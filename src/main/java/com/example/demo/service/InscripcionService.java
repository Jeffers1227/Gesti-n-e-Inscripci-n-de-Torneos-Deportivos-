package com.example.demo.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Inscripcion;
import com.example.demo.entity.Evento;
import com.example.demo.entity.Participante;
import com.example.demo.repository.InscripcionRepository;
import com.example.demo.repository.EventoRepository;
import com.example.demo.repository.ParticipanteRepository;

@Service
public class InscripcionService {
    private final InscripcionRepository inscripcionRepository;
    private final EventoRepository eventoRepository;
    private final ParticipanteRepository participanteRepository;

    public InscripcionService(InscripcionRepository inscripcionRepository,
                              EventoRepository eventoRepository,
                              ParticipanteRepository participanteRepository) {
        this.inscripcionRepository = inscripcionRepository;
        this.eventoRepository = eventoRepository;
        this.participanteRepository = participanteRepository;
    }

    @Transactional(readOnly = true)
    public List<Inscripcion> listar() {
        return inscripcionRepository.findAll(org.springframework.data.domain.Sort.by("id").ascending());
    }

    @Transactional(readOnly = true)
    public Inscripcion obtener(long id) {
        return inscripcionRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public List<Inscripcion> listarPorEvento(long eventoId) {
        return inscripcionRepository.buscarPorEvento(eventoId);
    }

    @Transactional(readOnly = true)
    public List<Inscripcion> listarPorParticipante(long participanteId) {
        return inscripcionRepository.buscarPorParticipante(participanteId);
    }

    @Transactional(readOnly = true)
    public boolean yaInscrito(long eventoId, long participanteId) {
        return inscripcionRepository.existeInscripcion(eventoId, participanteId);
    }

    @Transactional
    public Inscripcion crear(long eventoId, long participanteId, String equipo) {
        Evento evento = eventoRepository.getReferenceById(eventoId);
        Participante participante = participanteRepository.getReferenceById(participanteId);
        String equipoNormalizado = equipo == null || equipo.isBlank() ? null : equipo.trim();
        Inscripcion inscripcion = new Inscripcion(evento, participante, equipoNormalizado, Instant.now(), "CONFIRMADA");
        return inscripcionRepository.save(inscripcion);
    }

    @Transactional
    public boolean cancelar(long id) {
        Inscripcion inscripcion = inscripcionRepository.findById(id).orElse(null);
        if (inscripcion == null) {
            return false;
        }
        inscripcion.setEstado("CANCELADA");
        inscripcionRepository.save(inscripcion);
        return true;
    }

    @Transactional
    public boolean eliminar(long id) {
        if (!inscripcionRepository.existsById(id)) {
            return false;
        }
        inscripcionRepository.deleteById(id);
        return true;
    }
}