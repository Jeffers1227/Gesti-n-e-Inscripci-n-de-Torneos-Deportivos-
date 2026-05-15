// service/EventoService.java
package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Evento;
import com.example.demo.repository.EventoRepository;

@Service
public class EventoService {
    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    @Transactional(readOnly = true)
    public List<Evento> listar() {
        return eventoRepository.findAll(org.springframework.data.domain.Sort.by("id").ascending());
    }

    @Transactional(readOnly = true)
    public List<Evento> listarPorFecha(LocalDate fecha) {
        return eventoRepository.buscarPorFecha(fecha);
    }

    @Transactional(readOnly = true)
    public Evento obtener(long id) {
        return eventoRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public boolean existe(long id) {
        return eventoRepository.existsById(id);
    }

    @Transactional
    public Evento crear(LocalDate fecha, LocalTime hora, String lugar, String descripcion, int capacidadMaxima) {
        Evento evento = new Evento(fecha, hora, lugar, descripcion, capacidadMaxima);
        return eventoRepository.save(evento);
    }

    @Transactional
    public boolean eliminar(long id) {
        if (!eventoRepository.existsById(id)) {
            return false;
        }
        eventoRepository.deleteById(id);
        return true;
    }
}