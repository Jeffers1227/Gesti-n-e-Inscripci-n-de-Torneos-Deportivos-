// service/ContactoService.java
package com.example.demo.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.example.demo.entity.ContactoMensaje;

@Service
public class ContactoService {
    private final AtomicLong secuenciaId = new AtomicLong(1);
    private final ConcurrentMap<Long, ContactoMensaje> mensajes = new ConcurrentHashMap<>();
    private static final String EMAIL_PRINCIPAL = "EventosPJos@gmail.com";

    public String emailPrincipal() {
        return EMAIL_PRINCIPAL;
    }

    public List<ContactoMensaje> listarMensajes() {
        return mensajes.values().stream()
                .sorted(Comparator.comparing(ContactoMensaje::recibidoEn).reversed())
                .toList();
    }

    public ContactoMensaje obtener(long id) {
        return mensajes.get(id);
    }

    public ContactoMensaje registrar(String nombre, String correo, String asunto, String mensaje) {
        long id = secuenciaId.getAndIncrement();
        ContactoMensaje m = new ContactoMensaje(id, nombre, correo, asunto, mensaje, Instant.now());
        mensajes.put(id, m);
        return m;
    }
}