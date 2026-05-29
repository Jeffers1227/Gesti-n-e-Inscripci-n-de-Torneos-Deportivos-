package com.example.demo.service;

import java.util.Collections;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public CustomUserDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscamos el usuario en la base de datos por su email
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con el email: " + email));

        // Spring Security exige el prefijo "ROLE_" para manejar autorización por roles de forma correcta
        String nombreRol = "ROLE_" + usuario.getRol().name();

        // Devolvemos el usuario convertido al estándar de Spring Security
        return new User(
                usuario.getEmail(),
                usuario.getPassword(), // Contraseña cifrada de la BD
                Collections.singletonList(new SimpleGrantedAuthority(nombreRol))
        );
    }
}