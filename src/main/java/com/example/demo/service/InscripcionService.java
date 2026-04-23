package com.example.demo.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Inscripcion;

@Service
public class InscripcionService {
    private final AtomicLong secuenciaId = new AtomicLong(1);
    private final ConcurrentMap<Long, Inscripcion> inscripciones = new ConcurrentHashMap<>();

    public List<Inscripcion> listar() {
        return inscripciones.values().stream()
                .sorted(Comparator.comparingLong(Inscripcion::id))
                .toList();
    }

    public Inscripcion obtener(long id) {
        return inscripciones.get(id);
    }

    public List<Inscripcion> listarPorEvento(long eventoId) {
        return inscripciones.values().stream()
                .filter(i -> i.eventoId() == eventoId)
                .sorted(Comparator.comparing(Inscripcion::fechaInscripcion))
                .toList();
    }

    public List<Inscripcion> listarPorParticipante(long participanteId) {
        return inscripciones.values().stream()
                .filter(i -> i.participanteId() == participanteId)
                .sorted(Comparator.comparing(Inscripcion::fechaInscripcion))
                .toList();
    }

    public boolean yaInscrito(long eventoId, long participanteId) {
        return inscripciones.values().stream()
                .anyMatch(i -> i.eventoId() == eventoId && i.participanteId() == participanteId);
    }

    public Inscripcion crear(long eventoId, long participanteId) {
        long id = secuenciaId.getAndIncrement();
        Inscripcion inscripcion = new Inscripcion(id, eventoId, participanteId, Instant.now(), "CONFIRMADA");
        inscripciones.put(id, inscripcion);
        return inscripcion;
    }

    public boolean cancelar(long id) {
        Inscripcion i = inscripciones.get(id);
        if (i == null) return false;
        inscripciones.put(id, new Inscripcion(i.id(), i.eventoId(), i.participanteId(), i.fechaInscripcion(), "CANCELADA"));
        return true;
    }
}