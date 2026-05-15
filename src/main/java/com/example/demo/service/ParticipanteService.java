// service/ParticipanteService.java
package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Participante;
import com.example.demo.repository.ParticipanteRepository;

@Service
public class ParticipanteService {
    private final ParticipanteRepository participanteRepository;

    public ParticipanteService(ParticipanteRepository participanteRepository) {
        this.participanteRepository = participanteRepository;
    }

    @Transactional(readOnly = true)
    public List<Participante> listar() {
        return participanteRepository.findAll(org.springframework.data.domain.Sort.by("id").ascending());
    }

    @Transactional(readOnly = true)
    public Participante obtener(long id) {
        return participanteRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public boolean existe(long id) {
        return participanteRepository.existsById(id);
    }

    @Transactional(readOnly = true)
    public boolean correoEnUso(String correo) {
        return participanteRepository.existsByCorreoIgnoreCase(correo);
    }

    @Transactional
    public Participante crear(String nombre, String correo, String telefono, String categoria) {
        Participante participante = new Participante(nombre, correo, telefono, categoria);
        return participanteRepository.save(participante);
    }

    @Transactional
    public boolean eliminar(long id) {
        if (!participanteRepository.existsById(id)) {
            return false;
        }
        participanteRepository.deleteById(id);
        return true;
    }
}