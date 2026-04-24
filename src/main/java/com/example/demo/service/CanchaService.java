// service/CanchaService.java
package com.example.demo.service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Cancha;

@Service
public class CanchaService {
    private final AtomicLong secuenciaId = new AtomicLong(1);
    private final ConcurrentMap<Long, Cancha> canchas = new ConcurrentHashMap<>();

    public List<Cancha> listar() {
        return canchas.values().stream()
                .sorted(Comparator.comparingLong(Cancha::id))
                .toList();
    }

    public Cancha obtener(long id) {
        return canchas.get(id);
    }

    public boolean existe(long id) {
        return canchas.containsKey(id);
    }

    public Cancha crear(String nombre, String ubicacion, String tipo, double precioPorHora) {
        long id = secuenciaId.getAndIncrement();
        Cancha cancha = new Cancha(id, nombre, ubicacion, tipo, precioPorHora);
        canchas.put(id, cancha);
        return cancha;
    }

    public boolean eliminar(long id) {
        return canchas.remove(id) != null;
    }
}