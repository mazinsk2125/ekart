package com.ekart.product.service;

import com.ekart.product.dto.ProductDto;

import java.util.List;

/**
 * Product service contract (interface-first pattern).
 * The concrete implementation is {@link ProductServiceImpl}.
 */
public interface ProductService {

    List<ProductDto> getAllProducts();

    ProductDto getProduct(Integer productId);

    List<ProductDto> search(String term);

    ProductDto reduceStock(Integer productId, Integer quantity);
}
