package com.example.demo.controller;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.HttpStatus; 
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entity.Inscripcion;
import com.example.demo.entity.Participante;
import com.example.demo.service.InscripcionService;
import com.example.demo.service.ParticipanteService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@RestController
@RequestMapping("/participantes")
@CrossOrigin(originPatterns = "*")
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

    // SOLUCIÓN AL ERROR: Desenvolvemos el Optional de forma segura
    @GetMapping("/{id}")
    public Participante obtener(@PathVariable long id) {
        return participanteService.obtener(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Participante no encontrado"));
    }

    @GetMapping("/{id}/inscripciones")
    public List<Inscripcion> inscripciones(@PathVariable long id) {
        if (!participanteService.existe(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Participante no encontrado");
        }
        return inscripcionService.listarPorParticipante(id);
    }

    // APLICACIÓN DEL LABORATORIO S08/10: Uso de @Valid para evitar if() manuales
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Participante crear(@Valid @RequestBody ParticipanteCreateRequest request) {
        
        // Solo dejamos la validación de negocio (correo duplicado)
        if (participanteService.correoEnUso(request.correo().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado");
        }
        
        String categoria = request.categoria() == null ? "GENERAL" : request.categoria().trim().toUpperCase();
        return participanteService.crear(request.nombre().trim(), request.correo().trim(), request.telefono().trim(), categoria);
    }

    @PutMapping("/{id}")
    public Participante actualizar(@PathVariable long id, @Valid @RequestBody ParticipanteUpdateRequest request) {
        if (!participanteService.existe(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Participante no encontrado");
        }
        if (participanteService.correoEnUsoParaOtro(request.correo().trim(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El correo ya está registrado por otro participante");
        }
        String categoria = request.categoria() == null ? "GENERAL" : request.categoria().trim().toUpperCase();
        return participanteService.actualizar(id, request.nombre().trim(), request.correo().trim(), request.telefono().trim(), categoria);
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

    // DTO CON VALIDACIONES INTEGRADAS
    public record ParticipanteCreateRequest(
        @NotBlank(message = "Debe indicar nombre") 
        String nombre, 
        
        @NotBlank(message = "Debe indicar correo") 
        @Email(message = "Formato de correo inválido") 
        String correo, 
        
        @NotBlank(message = "Debe indicar teléfono") 
        String telefono, 
        
        String categoria
    ) {}

    public record ParticipanteUpdateRequest(
        @NotBlank(message = "Debe indicar nombre") 
        String nombre, 
        
        @NotBlank(message = "Debe indicar correo") 
        @Email(message = "Formato de correo inválido") 
        String correo, 
        
        @NotBlank(message = "Debe indicar teléfono") 
        String telefono, 
        
        String categoria
    ) {}
    
    public record CountResponse(int total) {}
}