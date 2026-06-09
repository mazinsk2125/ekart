package com.ekart.cart.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Mirrors the Cart API "Add Product to Cart" body:
 * { customerEmailId, cartProducts: [ { product: { productId }, quantity } ] }
 */
public class AddToCartRequest {

    @Email(message = "customerEmailId must be a valid email")
    private String customerEmailId;

    @NotEmpty(message = "cartProducts must not be empty")
    @Valid
    private List<Item> cartProducts;

    public static class Item {
        @NotNull(message = "product is required")
        @Valid
        private ProductRef product;

        @NotNull(message = "quantity is required")
        @Min(value = 1, message = "quantity must be at least 1")
        private Integer quantity;

        public ProductRef getProduct() {
            return product;
        }

        public void setProduct(ProductRef product) {
            this.product = product;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    public static class ProductRef {
        @NotNull(message = "productId is required")
        private Integer productId;

        public Integer getProductId() {
            return productId;
        }

        public void setProductId(Integer productId) {
            this.productId = productId;
        }
    }

    public String getCustomerEmailId() {
        return customerEmailId;
    }

    public void setCustomerEmailId(String customerEmailId) {
        this.customerEmailId = customerEmailId;
    }

    public List<Item> getCartProducts() {
        return cartProducts;
    }

    public void setCartProducts(List<Item> cartProducts) {
        this.cartProducts = cartProducts;
    }
}
