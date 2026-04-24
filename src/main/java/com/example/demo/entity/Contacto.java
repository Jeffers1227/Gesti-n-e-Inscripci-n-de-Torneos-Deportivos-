// entity/Contacto.java
package com.example.demo.entity;

import java.time.LocalDateTime;

public record Contacto(long id, String nombre, String email, String asunto, String mensaje, LocalDateTime fechaRegistro) {}
