package com.example.demo.entity;

import java.time.Instant;

public record Inscripcion(long id, long eventoId, long participanteId, Instant fechaInscripcion, String estado) {}