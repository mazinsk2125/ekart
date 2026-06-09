package com.ekart.product.controller;

import com.ekart.product.dto.ProductDto;
import com.ekart.product.dto.StockUpdateRequest;
import com.ekart.product.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/product-api")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductDto> getProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(productService.getProduct(productId));
    }

    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDto>> search(@RequestParam("q") String query) {
        return ResponseEntity.ok(productService.search(query));
    }

    /** Internal endpoint used by Order Service to update inventory. */
    @PutMapping("/product/{productId}/reduce-stock")
    public ResponseEntity<ProductDto> reduceStock(@PathVariable Integer productId,
                                                  @Valid @RequestBody StockUpdateRequest request) {
        return ResponseEntity.ok(productService.reduceStock(productId, request.getQuantity()));
    }
}
