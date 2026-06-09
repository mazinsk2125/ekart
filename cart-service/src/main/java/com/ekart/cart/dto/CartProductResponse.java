package com.ekart.cart.dto;

/**
 * Cart line item enriched with the full product (matches Cart API
 * "Get Products from Cart" response).
 */
public class CartProductResponse {

    private Integer cartProductId;
    private ProductDto product;
    private Integer quantity;

    public CartProductResponse() {
    }

    public CartProductResponse(Integer cartProductId, ProductDto product, Integer quantity) {
        this.cartProductId = cartProductId;
        this.product = product;
        this.quantity = quantity;
    }

    public Integer getCartProductId() {
        return cartProductId;
    }

    public void setCartProductId(Integer cartProductId) {
        this.cartProductId = cartProductId;
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
