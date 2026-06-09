package com.ekart.cart.service;

import com.ekart.cart.client.ProductClient;
import com.ekart.cart.dto.AddToCartRequest;
import com.ekart.cart.dto.CartProductResponse;
import com.ekart.cart.dto.ProductDto;
import com.ekart.cart.entity.Cart;
import com.ekart.cart.entity.CartProduct;
import com.ekart.cart.exception.EkartException;
import com.ekart.cart.repository.CartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;

    public CartService(CartRepository cartRepository, ProductClient productClient) {
        this.cartRepository = cartRepository;
        this.productClient = productClient;
    }

    @Transactional
    public Integer addToCart(AddToCartRequest request) {
        Cart cart = cartRepository.findByCustomerEmailId(request.getCustomerEmailId())
            .orElseGet(() -> new Cart(request.getCustomerEmailId()));

        for (AddToCartRequest.Item item : request.getCartProducts()) {
            Integer productId = item.getProduct().getProductId();

            // Validate the product actually exists in Product Service.
            ProductDto product = productClient.getProduct(productId);

            boolean alreadyPresent = cart.getCartProducts().stream()
                .anyMatch(cp -> cp.getProductId().equals(productId));
            if (alreadyPresent) {
                throw new EkartException("Product '" + product.getName() + "' is already added to the cart");
            }
            cart.addCartProduct(new CartProduct(productId, item.getQuantity()));
        }

        Cart saved = cartRepository.save(cart);
        return saved.getCartId();
    }

    @Transactional(readOnly = true)
    public List<CartProductResponse> getCartProducts(String customerEmailId) {
        Cart cart = cartRepository.findByCustomerEmailId(customerEmailId)
            .orElseThrow(() -> new EkartException("Sorry No cart found for you"));

        if (cart.getCartProducts().isEmpty()) {
            throw new EkartException("No products are available in your cart");
        }

        List<CartProductResponse> response = new ArrayList<>();
        for (CartProduct cp : cart.getCartProducts()) {
            ProductDto product = productClient.getProduct(cp.getProductId());
            response.add(new CartProductResponse(cp.getCartProductId(), product, cp.getQuantity()));
        }
        return response;
    }

    @Transactional
    public String updateQuantity(String customerEmailId, Integer productId, Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new EkartException("invalid data");
        }
        Cart cart = cartRepository.findByCustomerEmailId(customerEmailId)
            .orElseThrow(() -> new EkartException("Sorry No cart found for you"));

        CartProduct target = cart.getCartProducts().stream()
            .filter(cp -> cp.getProductId().equals(productId))
            .findFirst()
            .orElseThrow(() -> new EkartException("Product is not available in your cart"));

        target.setQuantity(quantity);
        cartRepository.save(cart);
        return "Quantity updated successfully";
    }

    @Transactional
    public String deleteProduct(String customerEmailId, Integer productId) {
        Cart cart = cartRepository.findByCustomerEmailId(customerEmailId)
            .orElseThrow(() -> new EkartException("Sorry No cart found for you"));

        CartProduct target = cart.getCartProducts().stream()
            .filter(cp -> cp.getProductId().equals(productId))
            .findFirst()
            .orElseThrow(() -> new EkartException("Product is not available in your cart"));

        cart.removeCartProduct(target);
        cartRepository.save(cart);
        return "Your item has been removed from cart";
    }

    /** Clears the cart after a successful order. Called by Order Service. */
    @Transactional
    public void clearCart(String customerEmailId) {
        cartRepository.findByCustomerEmailId(customerEmailId).ifPresent(cart -> {
            cart.getCartProducts().clear();
            cartRepository.save(cart);
        });
    }
}
