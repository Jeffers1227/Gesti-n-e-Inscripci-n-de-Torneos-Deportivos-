package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

	@Bean
	@SuppressWarnings("unused")
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
			.csrf(csrf -> csrf.disable())
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/**", "/eventos", "/participantes", "/inscripciones", "/canchas", "/contactos").permitAll()
				.requestMatchers("/styles.css", "/app.js").permitAll()
				.anyRequest().authenticated()
			)
			.httpBasic(basic -> {})
			.build();
	}
}

