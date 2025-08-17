package com.blogapplication.blogapplication.controller;


import com.blogapplication.blogapplication.model.AuthRequest;
import com.blogapplication.blogapplication.model.User;
import com.blogapplication.blogapplication.service.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
//@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {
        User registeredUser = authService.register(user);
        return ResponseEntity.ok(registeredUser);
    }

//    @PostMapping("/login")
//    public ResponseEntity<User> login(@RequestBody AuthRequest authRequest) {
//        User user = authService.login(authRequest.getEmail(), authRequest.getPassword());
//        return ResponseEntity.ok(user);
//    }







    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        User user = authService.login(authRequest.getEmail(), authRequest.getPassword());

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid credentials"));
        }

        return ResponseEntity.ok(user);
    }


}