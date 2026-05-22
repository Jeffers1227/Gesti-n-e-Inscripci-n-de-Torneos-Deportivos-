package com.example.demo.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.entity.Role;
import com.example.demo.service.UsuarioService;

@Configuration
public class UserSeeder {

	@Bean
	@SuppressWarnings("unused")
	ApplicationRunner seedUsuarios(UsuarioService usuarioService) {
		return args -> {
			if (!usuarioService.existeUsername("admin")) {
				usuarioService.registrar("admin", "admin123", Role.ADMIN);
			}
			if (!usuarioService.existeUsername("user")) {
				usuarioService.registrar("user", "user123", Role.USER);
			}
		};
	}
}
