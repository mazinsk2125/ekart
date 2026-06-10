package com.ekart.cart.service;

import com.ekart.cart.dto.AddToCartRequest;
import com.ekart.cart.dto.CartProductResponse;

import java.util.List;

/**
 * Cart service contract (interface-first pattern).
 * The concrete implementation is {@link CartServiceImpl}.
 */
public interface CartService {

    Integer addToCart(AddToCartRequest request);

    List<CartProductResponse> getCartProducts(String customerEmailId);

    String updateQuantity(String customerEmailId, Integer productId, Integer quantity);

    String deleteProduct(String customerEmailId, Integer productId);

    void clearCart(String customerEmailId);
}
