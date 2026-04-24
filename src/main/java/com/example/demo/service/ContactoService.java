// service/ContactoService.java
package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Contacto;

@Service
public class ContactoService {
    private final AtomicLong secuenciaId = new AtomicLong(1);
    private final ConcurrentMap<Long, Contacto> contactos = new ConcurrentHashMap<>();

    public List<Contacto> listar() {
        return contactos.values().stream()
                .sorted(Comparator.comparingLong(Contacto::id).reversed())
                .toList();
    }

    public Contacto obtener(long id) {
        return contactos.get(id);
    }

    public boolean existe(long id) {
        return contactos.containsKey(id);
    }

    public Contacto registrar(String nombre, String email, String asunto, String mensaje) {
        long id = secuenciaId.getAndIncrement();
        Contacto contacto = new Contacto(id, nombre, email, asunto, mensaje, LocalDateTime.now());
        contactos.put(id, contacto);
        return contacto;
    }

    public boolean eliminar(long id) {
        return contactos.remove(id) != null;
    }
}
