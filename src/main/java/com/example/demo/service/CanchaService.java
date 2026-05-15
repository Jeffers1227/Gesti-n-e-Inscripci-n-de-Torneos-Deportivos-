// service/CanchaService.java
package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.entity.Cancha;
import com.example.demo.repository.CanchaRepository;

@Service
public class CanchaService {
    private final CanchaRepository canchaRepository;

    public CanchaService(CanchaRepository canchaRepository) {
        this.canchaRepository = canchaRepository;
    }

    @Transactional(readOnly = true)
    public List<Cancha> listar() {
        return canchaRepository.findAll(org.springframework.data.domain.Sort.by("id").ascending());
    }

    @Transactional(readOnly = true)
    public Cancha obtener(long id) {
        return canchaRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public boolean existe(long id) {
        return canchaRepository.existsById(id);
    }

    @Transactional
    public Cancha crear(String nombre, String ubicacion, String tipo, double precioPorHora) {
        Cancha cancha = new Cancha(nombre, ubicacion, tipo, precioPorHora);
        return canchaRepository.save(cancha);
    }

    @Transactional
    public boolean eliminar(long id) {
        if (!canchaRepository.existsById(id)) {
            return false;
        }
        canchaRepository.deleteById(id);
        return true;
    }
}
