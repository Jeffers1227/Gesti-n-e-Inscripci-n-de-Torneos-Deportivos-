// entity/Evento.java
package com.example.demo.entity;

import java.time.LocalDate;
import java.time.LocalTime;

public record Evento(long id, LocalDate fecha, LocalTime hora, String lugar, String descripcion, int capacidadMaxima) {}