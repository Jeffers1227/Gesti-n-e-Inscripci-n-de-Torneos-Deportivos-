package com.example.demo.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Evento;

public interface EventoRepository extends JpaRepository<Evento, Long> {
    @Query("select e from Evento e where e.fecha = :fecha order by e.hora asc")
    List<Evento> buscarPorFecha(@Param("fecha") LocalDate fecha);
}
