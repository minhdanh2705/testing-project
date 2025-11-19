// Tên file: backend/backend/src/test/java/com/example/demo/controller/ProductControllerTest.java
package com.example.demo.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.any;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    // [cite: 2191]
    // Mock dependency (Repository)
    @Mock
    private ProductRepository productRepository;

    // Inject mock vào controller
    @InjectMocks
    private ProductController productController;

    private Product mockProduct;
    private UUID mockId;

    @BeforeEach
    void setUp() {
        mockId = UUID.randomUUID();
        mockProduct = new Product(
                mockId, 
                "Laptop", 
                "Mock Laptop", 
                new BigDecimal("1500.00"), 
                10, 
                "ACTIVE"
        );
    }

    // 
    @Test
    @DisplayName("Mock: Lấy tất cả sản phẩm")
    void testGetAllProducts() {
        // 1. Setup Mock
        List<Product> mockList = List.of(mockProduct);
        when(productRepository.findAll()).thenReturn(mockList);

        // 2. Hành động
        List<Product> result = productController.getAll();

        // 3. Assert
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
        assertEquals("Laptop", result.get(0).getName());
        
        // [cite: 2193]
        verify(productRepository, times(1)).findAll();
    }

    // 
    @Test
    @DisplayName("Mock: Lấy sản phẩm bằng ID thành công")
    void testGetProductById_Found() {
        // 1. Setup Mock
        when(productRepository.findById(mockId))
                .thenReturn(Optional.of(mockProduct));

        // 2. Hành động
        ResponseEntity<Product> response = productController.getById(mockId);

        // 3. Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(mockProduct, response.getBody());
        // [cite: 2193]
        verify(productRepository, times(1)).findById(mockId);
    }

    @Test
    @DisplayName("Mock: Lấy sản phẩm bằng ID thất bại (Not Found)")
    void testGetProductById_NotFound() {
        // 1. Setup Mock
        when(productRepository.findById(mockId)).thenReturn(Optional.empty());

        // 2. Hành động
        ResponseEntity<Product> response = productController.getById(mockId);

        // 3. Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        // [cite: 2193]
        verify(productRepository, times(1)).findById(mockId);
    }

    // 
    @Test
    @DisplayName("Mock: Tạo sản phẩm mới")
    void testCreateProduct() {
        // 1. Setup Mock
        // Khi gọi save với BẤT KỲ product nào
        when(productRepository.save(any(Product.class)))
                .thenReturn(mockProduct);

        Product newProduct = new Product(null, "Laptop", "Mock Laptop", new BigDecimal("1500.00"), 10, "ACTIVE");

        // 2. Hành động
        Product result = productController.create(newProduct);

        // 3. Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        // [cite: 2193]
        verify(productRepository, times(1)).save(any(Product.class));
    }

    // 
    @Test
    @DisplayName("Mock: Xóa sản phẩm thành công")
    void testDeleteProduct_Success() {
        // 1. Setup Mock
        // Giả lập là sản phẩm tồn tại
        when(productRepository.existsById(mockId)).thenReturn(true);
        // Giả lập hàm delete không làm gì cả
        doNothing().when(productRepository).deleteById(mockId);

        // 2. Hành động
        ResponseEntity<Void> response = productController.delete(mockId);

        // 3. Assert
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        // [cite: 2193]
        verify(productRepository, times(1)).existsById(mockId);
        verify(productRepository, times(1)).deleteById(mockId);
    }

    @Test
    @DisplayName("Mock: Xóa sản phẩm thất bại (Not Found)")
    void testDeleteProduct_NotFound() {
        // 1. Setup Mock
        when(productRepository.existsById(mockId)).thenReturn(false);

        // 2. Hành động
        ResponseEntity<Void> response = productController.delete(mockId);

        // 3. Assert
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        // [cite: 2193]
        // Verify hàm deleteById KHÔNG bao giờ được gọi
        verify(productRepository, never()).deleteById(any(UUID.class));
    }
}