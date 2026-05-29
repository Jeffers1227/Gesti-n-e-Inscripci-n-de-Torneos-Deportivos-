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

    public boolean correoEnUsoParaOtro(String correo, long idExcluir) {
        Optional<Participante> existente = repository.findAll().stream()
                .filter(p -> p.getCorreo().equalsIgnoreCase(correo) && p.getId() != idExcluir)
                .findFirst();
        return existente.isPresent();
    }

    @Transactional // Del Laboratorio 07: Protege la transacción en la BD
    public Participante crear(String nombre, String correo, String telefono, String categoria) {
        // Ya no le pasamos el ID, MySQL lo asignará automáticamente
        Participante participante = new Participante(nombre, correo, telefono, categoria);
        return repository.save(participante); // Lo guarda en MySQL
    }

    @Transactional // Del Laboratorio 07: Protege la transacción en la BD
    public Participante actualizar(long id, String nombre, String correo, String telefono, String categoria) {
        Optional<Participante> existente = repository.findById(id);
        if (existente.isPresent()) {
            Participante participante = existente.get();
            participante.setNombre(nombre);
            participante.setCorreo(correo);
            participante.setTelefono(telefono);
            participante.setCategoria(categoria);
            return repository.save(participante);
        }
        return null;
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