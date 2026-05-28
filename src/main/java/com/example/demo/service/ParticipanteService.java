package com.example.demo.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Participante;
import com.example.demo.repository.ParticipanteRepository;

@Service
public class ParticipanteService {
    
    // Inyectamos el repositorio que conecta con la BD
    private final ParticipanteRepository repository;

    public ParticipanteService(ParticipanteRepository repository) {
        this.repository = repository;
    }

    public List<Participante> listar() {
        return repository.findAll(); // Busca todos en la BD
    }

    public Optional<Participante> obtener(long id) {
        return repository.findById(id); // Busca por ID en la BD
    }

    public boolean existe(long id) {
        return repository.existsById(id);
    }

    public boolean correoEnUso(String correo) {
        return repository.existsByCorreoIgnoreCase(correo); // Usa la consulta que creamos
    }

    @Transactional // Del Laboratorio 07: Protege la transacción en la BD
    public Participante crear(String nombre, String correo, String telefono, String categoria) {
        // Ya no le pasamos el ID, MySQL lo asignará automáticamente
        Participante participante = new Participante(nombre, correo, telefono, categoria);
        return repository.save(participante); // Lo guarda en MySQL
    }

    @Transactional // Del Laboratorio 07: Protege la transacción en la BD
    public boolean eliminar(long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}