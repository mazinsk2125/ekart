package com.ekart.cart.controller;

import com.ekart.cart.dto.AddToCartRequest;
import com.ekart.cart.dto.CartProductResponse;
import com.ekart.cart.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/cart-api")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/products")
    public ResponseEntity<String> addToCart(@Valid @RequestBody AddToCartRequest request) {
        Integer cartId = cartService.addToCart(request);
        return ResponseEntity.ok("The products are successfully added to the cart having cartId : " + cartId);
    }

    @GetMapping("/customer/{customerEmailId}/products")
    public ResponseEntity<List<CartProductResponse>> getProducts(@PathVariable String customerEmailId) {
        return ResponseEntity.ok(cartService.getCartProducts(customerEmailId));
    }

    @PutMapping("/customer/{customerEmailId}/product/{productId}")
    public ResponseEntity<String> updateQuantity(@PathVariable String customerEmailId,
                                                 @PathVariable Integer productId,
                                                 @RequestBody Integer quantity) {
        return ResponseEntity.ok(cartService.updateQuantity(customerEmailId, productId, quantity));
    }

    @DeleteMapping("/customer/{customerEmailId}/product/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable String customerEmailId,
                                                @PathVariable Integer productId) {
        return ResponseEntity.ok(cartService.deleteProduct(customerEmailId, productId));
    }

    /** Internal: clear the cart after order placement. */
    @DeleteMapping("/customer/{customerEmailId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable String customerEmailId) {
        cartService.clearCart(customerEmailId);
        return ResponseEntity.noContent().build();
    }
}
