package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.demo.entity.Participante;

public interface ParticipanteRepository extends JpaRepository<Participante, Long> {
    // Consulta derivada (Del Laboratorio 07): Spring hace la consulta SQL por nosotros
    boolean existsByCorreoIgnoreCase(String correo);
}