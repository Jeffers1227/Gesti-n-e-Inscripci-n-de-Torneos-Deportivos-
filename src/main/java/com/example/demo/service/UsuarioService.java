package com.example.demo.service;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Role;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;

@Service
public class UsuarioService {
	private final UsuarioRepository usuarioRepository;
	private final PasswordEncoder passwordEncoder;

	public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
		this.usuarioRepository = usuarioRepository;
		this.passwordEncoder = passwordEncoder;
	}

	public Optional<Usuario> buscarPorUsername(String username) {
		return usuarioRepository.findByUsername(username);
	}

	public boolean existeUsername(String username) {
		return usuarioRepository.existsByUsername(username);
	}

	public Usuario registrar(String username, String rawPassword, Role role) {
		String encodedPassword = passwordEncoder.encode(rawPassword);
		Usuario usuario = new Usuario(username, encodedPassword, role);
		return usuarioRepository.save(usuario);
	}
}
