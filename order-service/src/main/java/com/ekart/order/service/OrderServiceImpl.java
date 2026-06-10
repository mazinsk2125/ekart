package com.ekart.order.service;

import com.ekart.order.client.CartClient;
import com.ekart.order.client.CustomerClient;
import com.ekart.order.client.ProductClient;
import com.ekart.order.dto.CartProductDto;
import com.ekart.order.dto.CustomerDto;
import com.ekart.order.dto.OrderResponse;
import com.ekart.order.dto.PlaceOrderRequest;
import com.ekart.order.dto.ProductDto;
import com.ekart.order.dto.StockUpdateRequest;
import com.ekart.order.entity.OrderEntity;
import com.ekart.order.entity.OrderedProduct;
import com.ekart.order.exception.EkartException;
import com.ekart.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Implementation of {@link OrderService}.
 *
 * Inter-service communication uses the reactive, Consul load-balanced
 * {@link CartClient}, {@link ProductClient} and {@link CustomerClient}
 * (WebClient + Mono/Flux). Reactive results are resolved at this service
 * boundary because the controller/JPA layer is blocking MVC.
 */
@Service
public class OrderServiceImpl implements OrderService {

    private static final String STATUS_PENDING_PAYMENT = "PENDING_PAYMENT";
    private static final String STATUS_CONFIRMED = "CONFIRMED";

    private final OrderRepository orderRepository;
    private final CartClient cartClient;
    private final ProductClient productClient;
    private final CustomerClient customerClient;

    public OrderServiceImpl(OrderRepository orderRepository,
                            CartClient cartClient,
                            ProductClient productClient,
                            CustomerClient customerClient) {
        this.orderRepository = orderRepository;
        this.cartClient = cartClient;
        this.productClient = productClient;
        this.customerClient = customerClient;
    }

    @Override
    @Transactional
    public Integer placeOrder(PlaceOrderRequest request) {
        // Reactive Flux from Cart Service, collected at the boundary.
        List<CartProductDto> cartItems;
        try {
            cartItems = cartClient.getCartProducts(request.getCustomerEmailId())
                .collectList()
                .block();
        } catch (Exception ex) {
            throw new EkartException("Your cart is empty or could not be retrieved");
        }
        if (cartItems == null || cartItems.isEmpty()) {
            throw new EkartException("Your cart is empty");
        }

        // Subtotal from current cart.
        double subtotal = cartItems.stream()
            .mapToDouble(ci -> ci.getProduct().getPrice() * ci.getQuantity())
            .sum();

        // Discount: 10% for Credit card, 5% for Debit card.
        String payment = request.getPaymentThrough() == null ? "" : request.getPaymentThrough().trim();
        double discountRate;
        if ("Credit".equalsIgnoreCase(payment)) {
            discountRate = 0.10;
        } else if ("Debit".equalsIgnoreCase(payment)) {
            discountRate = 0.05;
        } else {
            throw new EkartException("paymentThrough must be either 'Credit' or 'Debit'");
        }
        double discountAmount = round(subtotal * discountRate);
        double total = round(subtotal - discountAmount);

        // Delivery address from Customer Service (reactive Mono).
        String deliveryAddress;
        try {
            CustomerDto customer = customerClient.getCustomer(request.getCustomerEmailId()).block();
            if (customer == null) {
                throw new EkartException("No customer found with the email id");
            }
            deliveryAddress = customer.getAddress();
        } catch (EkartException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new EkartException("No customer found with the email id");
        }

        OrderEntity order = new OrderEntity();
        order.setCustomerEmailId(request.getCustomerEmailId());
        order.setDateOfOrder(LocalDateTime.now());
        order.setTotalPrice(total);
        order.setDiscount(discountAmount);
        order.setPaymentThrough(payment);
        order.setOrderStatus(STATUS_PENDING_PAYMENT);
        order.setDeliveryAddress(deliveryAddress);
        order.setDateOfDelivery(
            request.getDateOfDelivery() != null
                ? request.getDateOfDelivery()
                : LocalDateTime.now().plusDays(5));

        for (CartProductDto ci : cartItems) {
            order.addOrderedProduct(
                new OrderedProduct(ci.getProduct().getProductId(),
                    ci.getProduct().getPrice(),
                    ci.getQuantity()));
        }

        OrderEntity saved = orderRepository.save(order);

        // Update inventory (reactive) and clear the cart (reactive).
        for (CartProductDto ci : cartItems) {
            productClient.reduceStock(ci.getProduct().getProductId(),
                new StockUpdateRequest(ci.getQuantity())).block();
        }
        cartClient.clearCart(request.getCustomerEmailId()).block();

        return saved.getOrderId();
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String customerEmailId) {
        List<OrderEntity> orders =
            orderRepository.findByCustomerEmailIdOrderByDateOfOrderDesc(customerEmailId);
        if (orders.isEmpty()) {
            throw new EkartException("No orders are found for customer email id");
        }
        return orders.stream().map(this::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrder(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EkartException("Order not found"));
        return toResponse(order);
    }

    @Override
    @Transactional
    public void markConfirmed(Integer orderId) {
        OrderEntity order = orderRepository.findById(orderId)
            .orElseThrow(() -> new EkartException("Order not found"));
        order.setOrderStatus(STATUS_CONFIRMED);
        orderRepository.save(order);
    }

    private OrderResponse toResponse(OrderEntity order) {
        OrderResponse resp = new OrderResponse();
        resp.setOrderId(order.getOrderId());
        resp.setCustomerEmailId(order.getCustomerEmailId());
        resp.setDateOfOrder(order.getDateOfOrder());
        resp.setTotalPrice(order.getTotalPrice());
        resp.setOrderStatus(order.getOrderStatus());
        resp.setDiscount(order.getDiscount());
        resp.setPaymentThrough(order.getPaymentThrough());
        resp.setDateOfDelivery(order.getDateOfDelivery());
        resp.setDeliveryAddress(order.getDeliveryAddress());

        List<OrderResponse.OrderedProductResponse> products = new ArrayList<>();
        for (OrderedProduct op : order.getOrderedProducts()) {
            ProductDto product;
            try {
                product = productClient.getProduct(op.getProductId()).block();
                if (product == null) {
                    throw new IllegalStateException("empty product");
                }
            } catch (Exception ex) {
                // Fall back to the price snapshot if the product is unavailable.
                product = new ProductDto();
                product.setProductId(op.getProductId());
                product.setPrice(op.getUnitPrice());
                product.setName("Product #" + op.getProductId());
            }
            products.add(new OrderResponse.OrderedProductResponse(
                op.getOrderedProductId(), product, op.getQuantity()));
        }
        resp.setOrderedProducts(products);
        return resp;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
