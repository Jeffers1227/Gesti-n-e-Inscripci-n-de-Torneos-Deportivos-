// entity/ContactoMensaje.java
package com.example.demo.entity;

import java.time.Instant;

public record ContactoMensaje(long id, String nombre, String correo, String asunto, String mensaje, Instant recibidoEn) {}