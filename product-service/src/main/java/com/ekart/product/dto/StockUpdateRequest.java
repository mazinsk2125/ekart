package com.ekart.product.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** Used by Order Service to decrement inventory after a successful order. */
public class StockUpdateRequest {

    @NotNull(message = "quantity is required")
    @Min(value = 1, message = "quantity must be at least 1")
    private Integer quantity;

    public StockUpdateRequest() {
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
