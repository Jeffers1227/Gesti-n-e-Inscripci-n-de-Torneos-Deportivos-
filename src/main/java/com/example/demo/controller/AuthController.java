package com.example.demo.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entity.Role;
import com.example.demo.entity.Usuario;
import com.example.demo.security.JwtService;
import com.example.demo.service.UsuarioService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/auth")
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final UsuarioService usuarioService;
	private final JwtService jwtService;

	public AuthController(AuthenticationManager authenticationManager, UsuarioService usuarioService, JwtService jwtService) {
		this.authenticationManager = authenticationManager;
		this.usuarioService = usuarioService;
		this.jwtService = jwtService;
	}

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
		String username = request.username().trim();
		if (usuarioService.existeUsername(username)) {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya existe");
		}
		Usuario usuario = usuarioService.registrar(username, request.password(), Role.USER);
		String token = jwtService.generateToken(buildUserDetails(usuario), usuario.getRole().name());
		return new AuthResponse(token, usuario.getUsername(), usuario.getRole().name());
	}

	@PostMapping("/login")
	public AuthResponse login(@Valid @RequestBody AuthRequest request) {
		Authentication authentication = authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(request.username(), request.password()));
		UserDetails userDetails = (UserDetails) authentication.getPrincipal();
		String role = userDetails.getAuthorities().stream().findFirst()
			.map(auth -> auth.getAuthority().replace("ROLE_", ""))
			.orElse(Role.USER.name());
		String token = jwtService.generateToken(userDetails, role);
		return new AuthResponse(token, userDetails.getUsername(), role);
	}

	private UserDetails buildUserDetails(Usuario usuario) {
		return org.springframework.security.core.userdetails.User.withUsername(usuario.getUsername())
			.password(usuario.getPassword())
			.roles(usuario.getRole().name())
			.build();
	}

	public record RegisterRequest(@NotBlank String username, @NotBlank String password) {}
	public record AuthRequest(@NotBlank String username, @NotBlank String password) {}
	public record AuthResponse(String token, String username, String role) {}
}
