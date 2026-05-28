// service/CanchaService.java
package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Cancha;
import com.example.demo.repository.CanchaRepository;

@Service
@Transactional
public class CanchaService {

    @Autowired
    private CanchaRepository canchaRepository;

    public List<Cancha> listar() {
        return canchaRepository.findAll();
    }

    public Cancha obtener(long id) {
        return canchaRepository.findById((long) id).orElse(null);
    }

    public boolean existe(long id) {
        return canchaRepository.existsById((long) id);
    }

    public Cancha crear(String nombre, String ubicacion, String tipo, double precioPorHora) {
        Cancha cancha = new Cancha(nombre, ubicacion, tipo, precioPorHora);
        return canchaRepository.save(cancha);
    }

    public Cancha actualizar(long id, String nombre, String ubicacion, String tipo, double precioPorHora) {
        Cancha cancha = canchaRepository.findById((long) id).orElse(null);
        if (cancha != null) {
            cancha.setNombre(nombre);
            cancha.setUbicacion(ubicacion);
            cancha.setTipo(tipo);
            cancha.setPrecioPorHora(precioPorHora);
            return canchaRepository.save(cancha);
        }
        return null;
    }

    public boolean eliminar(long id) {
        if (canchaRepository.existsById((long) id)) {
            canchaRepository.deleteById((long) id);
            return true;
        }
        return false;
    }
}
