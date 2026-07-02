package com.example.demo;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.demo.entity.Rol;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;

@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(UsuarioRepository usuarios, PasswordEncoder passwordEncoder) {
        return args -> {
            try {
                if (!usuarios.existsByEmail("admin@demo.com")) {
                    Usuario admin = new Usuario(
                            "Administrador",
                            "admin@demo.com",
                            passwordEncoder.encode("Admin123"),
                            Rol.ADMIN
                    );
                    usuarios.save(admin);
                    System.out.println("✅ Usuario admin@demo.com creado con éxito en Clever Cloud.");
                } else {
                    System.out.println("👍 El usuario admin@demo.com ya existe.");
                }
            } catch (Exception e) {
                System.err.println("❌ Error al crear usuario inicial: " + e.getMessage());
            }
        };
    }
}