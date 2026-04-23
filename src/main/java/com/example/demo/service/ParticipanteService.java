// service/ParticipanteService.java
package com.example.demo.service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Participante;

@Service
public class ParticipanteService {
    private final AtomicLong secuenciaId = new AtomicLong(1);
    private final ConcurrentMap<Long, Participante> participantes = new ConcurrentHashMap<>();

    public List<Participante> listar() {
        return participantes.values().stream()
                .sorted(Comparator.comparingLong(Participante::id))
                .toList();
    }

    public Participante obtener(long id) {
        return participantes.get(id);
    }

    public boolean existe(long id) {
        return participantes.containsKey(id);
    }

    public boolean correoEnUso(String correo) {
        return participantes.values().stream()
                .anyMatch(p -> p.correo().equalsIgnoreCase(correo));
    }

    public Participante crear(String nombre, String correo, String telefono, String categoria) {
        long id = secuenciaId.getAndIncrement();
        Participante participante = new Participante(id, nombre, correo, telefono, categoria);
        participantes.put(id, participante);
        return participante;
    }

    public boolean eliminar(long id) {
        return participantes.remove(id) != null;
    }
}