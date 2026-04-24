// controller/ContactoController.java
package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.demo.entity.ContactoMensaje;
import com.example.demo.service.ContactoService;

@RestController
@RequestMapping("/contacto")
public class ContactoController {
    private final ContactoService contactoService;

    public ContactoController(ContactoService contactoService) {
        this.contactoService = contactoService;
    }

    @GetMapping
    public ContactoInfo obtenerInfo() {
        return new ContactoInfo(contactoService.emailPrincipal());
    }

    @GetMapping("/mensajes")
    public List<ContactoMensaje> listarMensajes() {
        return contactoService.listarMensajes();
    }

    @GetMapping("/mensajes/{id}")
    public ContactoMensaje obtenerMensaje(@PathVariable long id) {
        ContactoMensaje m = contactoService.obtener(id);
        if (m == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje no encontrado");
        return m;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ContactoRecibido registrar(@RequestBody ContactoCreateRequest request) {
        String nombre = request.nombre();
        String correo = request.correo();
        String asunto = request.asunto();
        String mensaje = request.mensaje();

        if (nombre == null || nombre.isBlank() || correo == null || correo.isBlank()
                || mensaje == null || mensaje.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar nombre, correo y mensaje");
        }
        if (asunto == null || asunto.isBlank()) asunto = "Consulta";

        ContactoMensaje registrado = contactoService.registrar(
                nombre.trim(), correo.trim(), asunto.trim(), mensaje.trim());

        return new ContactoRecibido(registrado.id(), contactoService.emailPrincipal(), "RECIBIDO");
    }

    @GetMapping("/mensajes/count")
    public CountResponse contar() {
        return new CountResponse(contactoService.listarMensajes().size());
    }

    public record ContactoInfo(String emailPrincipal) {}
    public record ContactoCreateRequest(String nombre, String correo, String asunto, String mensaje) {}
    public record ContactoRecibido(long id, String emailPrincipal, String estado) {}
    public record CountResponse(int total) {}
}