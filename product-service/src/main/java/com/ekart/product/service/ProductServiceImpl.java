package com.ekart.product.service;

import com.ekart.product.dto.ProductDto;
import com.ekart.product.entity.Product;
import com.ekart.product.exception.EkartException;
import com.ekart.product.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Implementation of {@link ProductService} — catalog, search and inventory.
 */
@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream().map(ProductDto::from).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ProductDto getProduct(Integer productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EkartException("Sorry product is not available"));
        return ProductDto.from(product);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductDto> search(String term) {
        if (term == null || term.isBlank()) {
            return getAllProducts();
        }
        List<Product> results =
            productRepository.findByNameContainingIgnoreCaseOrBrandContainingIgnoreCase(term, term);
        if (results.isEmpty()) {
            throw new EkartException("No products found for: " + term);
        }
        return results.stream().map(ProductDto::from).toList();
    }

    @Override
    @Transactional
    public ProductDto reduceStock(Integer productId, Integer quantity) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new EkartException("Sorry product is not available"));
        if (product.getAvailableQuantity() < quantity) {
            throw new EkartException("Insufficient stock for product: " + product.getName());
        }
        product.setAvailableQuantity(product.getAvailableQuantity() - quantity);
        productRepository.save(product);
        return ProductDto.from(product);
    }
}
