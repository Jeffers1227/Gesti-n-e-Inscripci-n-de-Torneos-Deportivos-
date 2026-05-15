// service/ContactoService.java
package com.example.demo.service;

import java.time.Instant;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.ContactoMensaje;
import com.example.demo.repository.ContactoMensajeRepository;

@Service
public class ContactoService {
    private static final String EMAIL_PRINCIPAL = "EventosPJos@gmail.com";
    private final ContactoMensajeRepository contactoMensajeRepository;

    public ContactoService(ContactoMensajeRepository contactoMensajeRepository) {
        this.contactoMensajeRepository = contactoMensajeRepository;
    }

    public String emailPrincipal() {
        return EMAIL_PRINCIPAL;
    }

    @Transactional(readOnly = true)
    public List<ContactoMensaje> listarMensajes() {
        return contactoMensajeRepository.listarRecientes();
    }

    @Transactional(readOnly = true)
    public ContactoMensaje obtener(long id) {
        return contactoMensajeRepository.findById(id).orElse(null);
    }

    @Transactional
    public ContactoMensaje registrar(String nombre, String correo, String asunto, String mensaje) {
        ContactoMensaje m = new ContactoMensaje(nombre, correo, asunto, mensaje, Instant.now());
        return contactoMensajeRepository.save(m);
    }

    @Transactional
    public boolean eliminar(long id) {
        if (!contactoMensajeRepository.existsById(id)) {
            return false;
        }
        contactoMensajeRepository.deleteById(id);
        return true;
    }
}
