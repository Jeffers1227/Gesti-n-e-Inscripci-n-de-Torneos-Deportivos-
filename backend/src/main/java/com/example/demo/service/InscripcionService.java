package com.example.demo.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Inscripcion;
import com.example.demo.repository.InscripcionRepository;

@Service
@Transactional
public class InscripcionService {

    @Autowired
    private InscripcionRepository inscripcionRepository;

    public List<Inscripcion> listar() {
        return inscripcionRepository.findAll();
    }

    public Inscripcion obtener(long id) {
        return inscripcionRepository.findById((long) id).orElse(null);
    }

    public List<Inscripcion> listarPorEvento(long eventoId) {
        return inscripcionRepository.findByEventoId((long) eventoId);
    }

    public List<Inscripcion> listarPorParticipante(long participanteId) {
        return inscripcionRepository.findByParticipanteId((long) participanteId);
    }

    public boolean yaInscrito(long eventoId, long participanteId) {
        List<Inscripcion> inscripciones = inscripcionRepository.findByEventoId((long) eventoId);
        return inscripciones.stream()
                .anyMatch(i -> i.getParticipanteId() == participanteId);
    }

    public Inscripcion crear(long eventoId, long participanteId, String equipo) {
        String equipoNormalizado = equipo == null || equipo.isBlank() ? null : equipo.trim();
        Inscripcion inscripcion = new Inscripcion(
            (long) eventoId,
            (long) participanteId,
            equipoNormalizado,
            Instant.now(),
            "CONFIRMADA"
        );
        return inscripcionRepository.save(inscripcion);
    }

    public boolean cancelar(long id) {
        Inscripcion inscripcion = inscripcionRepository.findById((long) id).orElse(null);
        if (inscripcion == null) return false;
        inscripcion.setEstado("CANCELADA");
        inscripcionRepository.save(inscripcion);
        return true;
    }

    public boolean eliminar(long id) {
        if (inscripcionRepository.existsById((long) id)) {
            inscripcionRepository.deleteById((long) id);
            return true;
        }
        return false;
    }
}
