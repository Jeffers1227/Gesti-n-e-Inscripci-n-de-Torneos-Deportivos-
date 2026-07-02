package com.example.demo.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.AuthResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(originPatterns = "*") 
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // Ruta para registrar a un nuevo organizador o usuario
    @PostMapping("/register")
    public ResponseEntity<String> registrar(@Valid @RequestBody RegisterRequest request) {
        authService.registrar(request);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario registrado correctamente para el torneo"); 
    }

    // Ruta para iniciar sesión y obtener el Token JWT
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            // Si todo sale bien, devuelve el token
            return ResponseEntity.ok(authService.login(request)); 
        } catch (Exception e) {
            // Si falla, atrapamos el error y te lo mostramos en Postman o Consola
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("❌ Error al iniciar sesión: " + e.getMessage());
        }
    }
}