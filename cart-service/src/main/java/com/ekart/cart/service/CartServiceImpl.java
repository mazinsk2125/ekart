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

/**
 * Implementation of {@link CartService}.
 *
 * Inter-service calls go through the reactive, Consul load-balanced
 * {@link ProductClient} (WebClient + Mono). Because the controller/JPA layer
 * is blocking MVC, the reactive results are resolved at this service boundary.
 */
@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final ProductClient productClient;

    public CartServiceImpl(CartRepository cartRepository, ProductClient productClient) {
        this.cartRepository = cartRepository;
        this.productClient = productClient;
    }

    @Override
    @Transactional
    public Integer addToCart(AddToCartRequest request) {
        Cart cart = cartRepository.findByCustomerEmailId(request.getCustomerEmailId())
            .orElseGet(() -> new Cart(request.getCustomerEmailId()));

        for (AddToCartRequest.Item item : request.getCartProducts()) {
            Integer productId = item.getProduct().getProductId();

            // Validate the product exists in Product Service (reactive call).
            ProductDto product = productClient.getProduct(productId)
                .blockOptional()
                .orElseThrow(() -> new EkartException("Sorry product is not available"));

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

    @Override
    @Transactional(readOnly = true)
    public List<CartProductResponse> getCartProducts(String customerEmailId) {
        Cart cart = cartRepository.findByCustomerEmailId(customerEmailId)
            .orElseThrow(() -> new EkartException("Sorry No cart found for you"));

        if (cart.getCartProducts().isEmpty()) {
            throw new EkartException("No products are available in your cart");
        }

        List<CartProductResponse> response = new ArrayList<>();
        for (CartProduct cp : cart.getCartProducts()) {
            ProductDto product = productClient.getProduct(cp.getProductId())
                .blockOptional()
                .orElseThrow(() -> new EkartException("Sorry product is not available"));
            response.add(new CartProductResponse(cp.getCartProductId(), product, cp.getQuantity()));
        }
        return response;
    }

    @Override
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

    @Override
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

    @Override
    @Transactional
    public void clearCart(String customerEmailId) {
        cartRepository.findByCustomerEmailId(customerEmailId).ifPresent(cart -> {
            cart.getCartProducts().clear();
            cartRepository.save(cart);
        });
    }
}
