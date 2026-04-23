// controller/EventoController.java
package com.example.demo.controller;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entity.Evento;
import com.example.demo.service.EventoService;

@RestController
@RequestMapping("/eventos")
public class EventoController {
    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    @GetMapping
    public List<Evento> listar() {
        return eventoService.listar();
    }

    @GetMapping("/{id}")
    public Evento obtener(@PathVariable long id) {
        Evento evento = eventoService.obtener(id);
        if (evento == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }
        return evento;
    }

    @GetMapping("/fecha/{fecha}")
    public List<Evento> listarPorFecha(@PathVariable LocalDate fecha) {
        return eventoService.listarPorFecha(fecha);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Evento crear(@RequestBody EventoCreateRequest request) {
        String lugar = request.lugar();
        if (request.fecha() == null || request.hora() == null || lugar == null || lugar.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar fecha, hora y lugar");
        }
        int capacidad = request.capacidadMaxima() > 0 ? request.capacidadMaxima() : 20;
        String descripcion = request.descripcion() == null ? "" : request.descripcion().trim();
        return eventoService.crear(request.fecha(), request.hora(), lugar.trim(), descripcion, capacidad);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable long id) {
        if (!eventoService.eliminar(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }
    }

    @GetMapping("/count")
    public CountResponse contar() {
        return new CountResponse(eventoService.listar().size());
    }

    public record EventoCreateRequest(LocalDate fecha, LocalTime hora, String lugar, String descripcion, int capacidadMaxima) {}
    public record CountResponse(int total) {}
}