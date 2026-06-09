package com.ekart.order.dto;

/** Body for Product Service's reduce-stock endpoint. */
public class StockUpdateRequest {

    private Integer quantity;

    public StockUpdateRequest() {
    }

    public StockUpdateRequest(Integer quantity) {
        this.quantity = quantity;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
