package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entity.Inscripcion;
import com.example.demo.service.EventoService;
import com.example.demo.service.InscripcionService;
import com.example.demo.service.ParticipanteService;

@RestController
@RequestMapping("/inscripciones")
public class InscripcionController {
    private final InscripcionService inscripcionService;
    private final EventoService eventoService;
    private final ParticipanteService participanteService;

    public InscripcionController(InscripcionService inscripcionService,
                                  EventoService eventoService,
                                  ParticipanteService participanteService) {
        this.inscripcionService = inscripcionService;
        this.eventoService = eventoService;
        this.participanteService = participanteService;
    }

    @GetMapping
    public List<Inscripcion> listar() {
        return inscripcionService.listar();
    }

    @GetMapping("/{id}")
    public Inscripcion obtener(@PathVariable long id) {
        Inscripcion i = inscripcionService.obtener(id);
        if (i == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscripción no encontrada");
        return i;
    }

    @GetMapping("/evento/{eventoId}")
    public List<Inscripcion> porEvento(@PathVariable long eventoId) {
        if (!eventoService.existe(eventoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }
        return inscripcionService.listarPorEvento(eventoId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Inscripcion crear(@RequestBody InscripcionCreateRequest request) {
        if (!eventoService.existe(request.eventoId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento no encontrado");
        }
        if (!participanteService.existe(request.participanteId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Participante no encontrado");
        }
        if (inscripcionService.yaInscrito(request.eventoId(), request.participanteId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El participante ya está inscrito en este evento");
        }
        return inscripcionService.crear(request.eventoId(), request.participanteId(), request.equipo());
    }

    @PatchMapping("/{id}/cancelar")
    public Inscripcion cancelar(@PathVariable long id) {
        if (inscripcionService.obtener(id) == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Inscripción no encontrada");
        }
        inscripcionService.cancelar(id);
        return inscripcionService.obtener(id);
    }

    @GetMapping("/count")
    public CountResponse contar() {
        return new CountResponse(inscripcionService.listar().size());
    }

    public record InscripcionCreateRequest(long eventoId, long participanteId, String equipo) {}
    public record CountResponse(int total) {}
}