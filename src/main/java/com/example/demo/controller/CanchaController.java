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
    public Cancha crear(@RequestBody Cancha cancha) {
        return canchaService.crear(cancha.nombre(), cancha.ubicacion(), cancha.tipo(), cancha.precioHora());
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable long id) {
        if (!canchaService.eliminar(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cancha no encontrada");
        }
    }
}
