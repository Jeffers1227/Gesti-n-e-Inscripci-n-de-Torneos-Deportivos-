// service/ContactoService.java
package com.example.demo.service;

import java.time.Instant;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.ContactoMensaje;
import com.example.demo.repository.ContactoMensajeRepository;

@Service
@Transactional
public class ContactoService {

    @Autowired
    private ContactoMensajeRepository contactoRepository;

    private static final String EMAIL_PRINCIPAL = "EventosPJos@gmail.com";

    public String emailPrincipal() {
        return EMAIL_PRINCIPAL;
    }

    public List<ContactoMensaje> listarMensajes() {
        return contactoRepository.findAll();
    }

    public ContactoMensaje obtener(long id) {
        return contactoRepository.findById((long) id).orElse(null);
    }

    public ContactoMensaje registrar(String nombre, String correo, String asunto, String mensaje) {
        ContactoMensaje m = new ContactoMensaje(nombre, correo, asunto, mensaje, Instant.now());
        return contactoRepository.save(m);
    }

    public boolean eliminar(long id) {
        if (contactoRepository.existsById((long) id)) {
            contactoRepository.deleteById((long) id);
            return true;
        }
        return false;
    }
}

