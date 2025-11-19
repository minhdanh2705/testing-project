// Tên file: backend/backend/src/test/java/com/example/demo/controller/AuthControllerTest.java
package com.example.demo.controller;

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import static org.mockito.ArgumentMatchers.anyString;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.JwtService;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    // 
    // Mock các dependencies mà AuthController cần
    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    // Tự động inject các @Mock ở trên vào AuthController
    @InjectMocks
    private AuthController authController;

    private User mockUser;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        // Chuẩn bị dữ liệu giả
        UUID userId = UUID.randomUUID();
        mockUser = new User();
        mockUser.setId(userId);
        mockUser.setUsername("testuser");
        mockUser.setPasswordHash("hashedPassword123");

        loginRequest = new LoginRequest();
        loginRequest.setUsername("testuser");
        loginRequest.setPassword("Password123");
    }

    // [cite: 2104]
    @Test
    @DisplayName("Mock: Đăng nhập thành công")
    void testLoginSuccess() {
        // 1. Setup Mocks
        // Khi userRepository.findByUsername được gọi -> trả về user giả
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(mockUser));
        
        // Khi passwordEncoder.matches được gọi -> trả về true
        when(passwordEncoder.matches("Password123", "hashedPassword123"))
                .thenReturn(true);
        
        // Khi jwtService.generateToken được gọi -> trả về token giả
        when(jwtService.generateToken(anyString(), anyString()))
                .thenReturn("mock.jwt.token");

        // 2. Hành động
        ResponseEntity<?> responseEntity = authController.login(loginRequest);

        // 3. Assert (Kiểm tra)
        assertEquals(HttpStatus.OK, responseEntity.getStatusCode());
        LoginResponse responseBody = (LoginResponse) responseEntity.getBody();
        assertNotNull(responseBody);
        assertEquals("mock.jwt.token", responseBody.getToken());
        assertEquals("testuser", responseBody.getUsername());

        // [cite: 2105]
        // Verify (Kiểm tra mock đã được gọi)
        verify(userRepository, times(1)).findByUsername("testuser");
        verify(passwordEncoder, times(1)).matches("Password123", "hashedPassword123");
        verify(jwtService, times(1)).generateToken(mockUser.getId().toString(), "testuser");
    }

    @Test
    @DisplayName("Mock: Đăng nhập thất bại - Sai Username")
    void testLoginFail_UserNotFound() {
        // 1. Setup Mocks
        // Giả lập user không tồn tại
        when(userRepository.findByUsername("wronguser"))
                .thenReturn(Optional.empty());

        loginRequest.setUsername("wronguser");

        // 2. Hành động
        ResponseEntity<?> responseEntity = authController.login(loginRequest);

        // 3. Assert (Kiểm tra)
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        assertEquals("Invalid username or password", responseEntity.getBody());

        // [cite: 2105]
        // Verify rằng passwordEncoder KHÔNG bao giờ được gọi
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtService, never()).generateToken(anyString(), anyString());
    }

    @Test
    @DisplayName("Mock: Đăng nhập thất bại - Sai Password")
    void testLoginFail_WrongPassword() {
        // 1. Setup Mocks
        when(userRepository.findByUsername("testuser"))
                .thenReturn(Optional.of(mockUser));
        
        // Giả lập password sai
        when(passwordEncoder.matches("wrongPassword", "hashedPassword123"))
                .thenReturn(false);

        loginRequest.setPassword("wrongPassword");

        // 2. Hành động
        ResponseEntity<?> responseEntity = authController.login(loginRequest);

        // 3. Assert (Kiểm tra)
        assertEquals(HttpStatus.UNAUTHORIZED, responseEntity.getStatusCode());
        assertEquals("Invalid username or password", responseEntity.getBody());

        // [cite: 2105]
        // Verify rằng jwtService KHÔNG bao giờ được gọi
        verify(jwtService, never()).generateToken(anyString(), anyString());
    }
}