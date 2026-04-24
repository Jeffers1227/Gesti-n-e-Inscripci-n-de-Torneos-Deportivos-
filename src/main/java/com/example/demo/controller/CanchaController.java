// controller/CanchaController.java
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

import com.example.demo.entity.Cancha;
import com.example.demo.service.CanchaService;

@RestController
@RequestMapping("/canchas")
public class CanchaController {
    private final CanchaService canchaService;

    public CanchaController(CanchaService canchaService) {
        this.canchaService = canchaService;
    }

    @GetMapping
    public List<Cancha> listar() {
        return canchaService.listar();
    }

    @GetMapping("/{id}")
    public Cancha obtener(@PathVariable long id) {
        Cancha cancha = canchaService.obtener(id);
        if (cancha == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cancha no encontrada");
        }
        return cancha;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Cancha crear(@RequestBody CanchaCreateRequest request) {
        String nombre = request.nombre();
        String ubicacion = request.ubicacion();
        String tipo = request.tipo();
        if (nombre == null || nombre.isBlank() || ubicacion == null || ubicacion.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debe indicar nombre y ubicación");
        }
        if (request.precioPorHora() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El precio no puede ser negativo");
        }
        String tipoFinal = (tipo == null || tipo.isBlank()) ? "STANDARD" : tipo.trim().toUpperCase();
        return canchaService.crear(nombre.trim(), ubicacion.trim(), tipoFinal, request.precioPorHora());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable long id) {
        if (!canchaService.eliminar(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cancha no encontrada");
        }
    }

    @GetMapping("/count")
    public CountResponse contar() {
        return new CountResponse(canchaService.listar().size());
    }

    public record CanchaCreateRequest(String nombre, String ubicacion, String tipo, double precioPorHora) {}
    public record CountResponse(int total) {}
}
