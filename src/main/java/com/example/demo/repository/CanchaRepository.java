package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Cancha;

public interface CanchaRepository extends JpaRepository<Cancha, Long> {}
