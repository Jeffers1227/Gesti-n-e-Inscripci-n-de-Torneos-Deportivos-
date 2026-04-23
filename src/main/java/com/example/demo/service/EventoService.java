// service/EventoService.java
package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Evento;

@Service
public class EventoService {
    private final AtomicLong secuenciaId = new AtomicLong(1);
    private final ConcurrentMap<Long, Evento> eventos = new ConcurrentHashMap<>();

    public List<Evento> listar() {
        return eventos.values().stream()
                .sorted(Comparator.comparingLong(Evento::id))
                .toList();
    }

    public List<Evento> listarPorFecha(LocalDate fecha) {
        return eventos.values().stream()
                .filter(e -> e.fecha().equals(fecha))
                .sorted(Comparator.comparing(Evento::hora))
                .toList();
    }

    public Evento obtener(long id) {
        return eventos.get(id);
    }

    public boolean existe(long id) {
        return eventos.containsKey(id);
    }

    public Evento crear(LocalDate fecha, LocalTime hora, String lugar, String descripcion, int capacidadMaxima) {
        long id = secuenciaId.getAndIncrement();
        Evento evento = new Evento(id, fecha, hora, lugar, descripcion, capacidadMaxima);
        eventos.put(id, evento);
        return evento;
    }

    public boolean eliminar(long id) {
        return eventos.remove(id) != null;
    }
}