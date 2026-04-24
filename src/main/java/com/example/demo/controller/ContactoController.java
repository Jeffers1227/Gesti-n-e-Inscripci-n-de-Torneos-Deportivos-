// controller/ContactoController.java
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

import com.example.demo.entity.Contacto;
import com.example.demo.service.ContactoService;

@RestController
@RequestMapping("/contactos")
public class ContactoController {
    private final ContactoService contactoService;

    public ContactoController(ContactoService contactoService) {
        this.contactoService = contactoService;
    }

    @GetMapping
    public List<Contacto> listar() {
        return contactoService.listar();
    }

    @GetMapping("/{id}")
    public Contacto obtener(@PathVariable long id) {
        Contacto contacto = contactoService.obtener(id);
        if (contacto == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje de contacto no encontrado");
        }
        return contacto;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Contacto crear(@RequestBody Contacto contacto) {
        return contactoService.registrar(contacto.nombre(), contacto.email(), contacto.asunto(), contacto.mensaje());
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable long id) {
        if (!contactoService.eliminar(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje de contacto no encontrado");
        }
    }
}
