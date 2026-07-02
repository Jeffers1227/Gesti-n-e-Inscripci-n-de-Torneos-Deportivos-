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
                // Cambiamos el correo a superadmin@demo.com para evitar chocar con datos viejos
                if (!usuarios.existsByEmail("superadmin@demo.com")) {
                    Usuario admin = new Usuario(
                            "Super Administrador",
                            "superadmin@demo.com",
                            passwordEncoder.encode("SuperAdmin123"),
                            Rol.ADMIN
                    );
                    usuarios.save(admin);
                    System.out.println("✅ Usuario superadmin@demo.com creado con éxito en Clever Cloud.");
                } else {
                    System.out.println("👍 El usuario superadmin@demo.com ya existe.");
                }
            } catch (Exception e) {
                System.err.println("❌ Error al crear usuario inicial: " + e.getMessage());
            }
        };
    }
}