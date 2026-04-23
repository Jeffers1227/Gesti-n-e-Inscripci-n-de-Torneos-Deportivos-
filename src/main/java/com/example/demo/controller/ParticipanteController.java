// controller/ParticipanteController.java
package com.example.demo.controller;

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

import com.example.demo.entity.Inscripcion;
import com.example.demo.entity.Participante;
import com.example.demo.service.InscripcionService;
import com.example.demo.service.ParticipanteService;

@RestController
@RequestMapping("/participantes")
public class ParticipanteController {
    private final ParticipanteService participanteService;
    private final InscripcionService inscripcionService;

    public ParticipanteController(ParticipanteService participanteService, InscripcionService inscripcionService) {
        this.participanteService = participanteService;
        this.inscripcionService = inscripcionService;
    }

    @GetMapping
    public List<Participante> listar() {
        return participanteService.listar();
    }

    @GetMapping("/{id}")
    public Participante obtener(@PathVariable long id) {
        Participante p = participanteService.obtener(id);
        if (p == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Participante no encontrado");
        return p;
    }

    @GetMapping("/{id}/inscripciones")
    public List<Inscripcion> inscripciones(@PathVariable long id) {
        if (!participanteService.existe(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Participante no encontrado");
        }
        return inscripcionService.listarPorParticipante(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Participante crear(@RequestBody ParticipanteCreateRequest request) {
        String nombre = request.nombre();
        String correo = request.correo();
        if (nombre == null || nombre.isBlank() || correo == null || correo.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar nombre y correo");
        }
        if (participanteService.correoEnUso(correo.trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }
        String telefono = request.telefono() == null ? "" : request.telefono().trim();
        String categoria = request.categoria() == null ? "GENERAL" : request.categoria().trim().toUpperCase();
        return participanteService.crear(nombre.trim(), correo.trim(), telefono, categoria);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable long id) {
        if (!participanteService.eliminar(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Participante no encontrado");
        }
    }

    @GetMapping("/count")
    public CountResponse contar() {
        return new CountResponse(participanteService.listar().size());
    }

    public record ParticipanteCreateRequest(String nombre, String correo, String telefono, String categoria) {}
    public record CountResponse(int total) {}
}