// service/EventoService.java
package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Evento;
import com.example.demo.repository.EventoRepository;

@Service
@Transactional
public class EventoService {

    @Autowired
    private EventoRepository eventoRepository;

    public List<Evento> listar() {
        return eventoRepository.findAll();
    }

    public List<Evento> listarPorFecha(LocalDate fecha) {
        return eventoRepository.findByFecha(fecha);
    }

    public Evento obtener(long id) {
        return eventoRepository.findById((long) id).orElse(null);
    }

    public boolean existe(long id) {
        return eventoRepository.existsById((long) id);
    }

    public Evento crear(LocalDate fecha, LocalTime hora, String lugar, String descripcion, int capacidadMaxima) {
        Evento evento = new Evento(fecha, hora, lugar, descripcion, capacidadMaxima);
        return eventoRepository.save(evento);
    }

    public Evento actualizar(long id, LocalDate fecha, LocalTime hora, String lugar, String descripcion, int capacidadMaxima) {
        Evento evento = eventoRepository.findById((long) id).orElse(null);
        if (evento != null) {
            evento.setFecha(fecha);
            evento.setHora(hora);
            evento.setLugar(lugar);
            evento.setDescripcion(descripcion);
            evento.setCapacidadMaxima(capacidadMaxima);
            return eventoRepository.save(evento);
        }
        return null;
    }

    public boolean eliminar(long id) {
        if (eventoRepository.existsById((long) id)) {
            eventoRepository.deleteById((long) id);
            return true;
        }
        return false;
    }
}