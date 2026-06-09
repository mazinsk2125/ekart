package com.ekart.product.dto;

import com.ekart.product.entity.Product;

/** Product representation returned by the Product API (matches the PDF contract). */
public class ProductDto {

    private Integer productId;
    private String name;
    private String description;
    private String category;
    private String brand;
    private Double price;
    private Integer availableQuantity;
    private String imageUrl;

    public ProductDto() {
    }

    public static ProductDto from(Product p) {
        ProductDto dto = new ProductDto();
        dto.productId = p.getProductId();
        dto.name = p.getName();
        dto.description = p.getDescription();
        dto.category = p.getCategory();
        dto.brand = p.getBrand();
        dto.price = p.getPrice();
        dto.availableQuantity = p.getAvailableQuantity();
        dto.imageUrl = p.getImageUrl();
        return dto;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public void setAvailableQuantity(Integer availableQuantity) {
        this.availableQuantity = availableQuantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
