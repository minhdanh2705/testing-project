package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ĐĂNG KÝ
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        // check trùng username
        if (userRepository.findByUsername(req.getUsername()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Username is already taken");
        }

        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername(req.getUsername());
        user.setPasswordHash(passwordEncoder.encode(req.getPassword()));

        userRepository.save(user);

        // Không trả mật khẩu về client
        return ResponseEntity.ok("Register successfully");
    }

    // ĐĂNG NHẬP
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        Optional<User> userOpt = userRepository.findByUsername(req.getUsername());

        if (userOpt.isEmpty()) {
            // sai username
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        User user = userOpt.get();

        boolean passwordMatches = passwordEncoder.matches(
                req.getPassword(),
                user.getPasswordHash()
        );

        if (!passwordMatches) {
            // sai password
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        // Ở đây tạm thời trả message + id user
        // Sau này bạn có thể tạo JWT token rồi trả về luôn
        return ResponseEntity.ok("Login successfully, userId = " + user.getId());
    }
}
