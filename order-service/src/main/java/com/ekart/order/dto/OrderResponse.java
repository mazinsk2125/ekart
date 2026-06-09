package com.ekart.order.dto;

import java.time.LocalDateTime;
import java.util.List;

/** Full order representation matching the Order API "Get Orders" response. */
public class OrderResponse {

    private Integer orderId;
    private String customerEmailId;
    private LocalDateTime dateOfOrder;
    private Double totalPrice;
    private String orderStatus;
    private Double discount;
    private String paymentThrough;
    private LocalDateTime dateOfDelivery;
    private String deliveryAddress;
    private List<OrderedProductResponse> orderedProducts;

    public static class OrderedProductResponse {
        private Integer orderedProductId;
        private ProductDto product;
        private Integer quantity;

        public OrderedProductResponse() {
        }

        public OrderedProductResponse(Integer orderedProductId, ProductDto product, Integer quantity) {
            this.orderedProductId = orderedProductId;
            this.product = product;
            this.quantity = quantity;
        }

        public Integer getOrderedProductId() {
            return orderedProductId;
        }

        public void setOrderedProductId(Integer orderedProductId) {
            this.orderedProductId = orderedProductId;
        }

        public ProductDto getProduct() {
            return product;
        }

        public void setProduct(ProductDto product) {
            this.product = product;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getCustomerEmailId() {
        return customerEmailId;
    }

    public void setCustomerEmailId(String customerEmailId) {
        this.customerEmailId = customerEmailId;
    }

    public LocalDateTime getDateOfOrder() {
        return dateOfOrder;
    }

    public void setDateOfOrder(LocalDateTime dateOfOrder) {
        this.dateOfOrder = dateOfOrder;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getOrderStatus() {
        return orderStatus;
    }

    public void setOrderStatus(String orderStatus) {
        this.orderStatus = orderStatus;
    }

    public Double getDiscount() {
        return discount;
    }

    public void setDiscount(Double discount) {
        this.discount = discount;
    }

    public String getPaymentThrough() {
        return paymentThrough;
    }

    public void setPaymentThrough(String paymentThrough) {
        this.paymentThrough = paymentThrough;
    }

    public LocalDateTime getDateOfDelivery() {
        return dateOfDelivery;
    }

    public void setDateOfDelivery(LocalDateTime dateOfDelivery) {
        this.dateOfDelivery = dateOfDelivery;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public List<OrderedProductResponse> getOrderedProducts() {
        return orderedProducts;
    }

    public void setOrderedProducts(List<OrderedProductResponse> orderedProducts) {
        this.orderedProducts = orderedProducts;
    }
}
