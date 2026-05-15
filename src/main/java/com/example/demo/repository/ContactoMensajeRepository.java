package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.demo.entity.ContactoMensaje;

public interface ContactoMensajeRepository extends JpaRepository<ContactoMensaje, Long> {
    @Query("select c from ContactoMensaje c order by c.recibidoEn desc")
    List<ContactoMensaje> listarRecientes();
}
