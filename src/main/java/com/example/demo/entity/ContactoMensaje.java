// entity/ContactoMensaje.java
package com.example.demo.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contacto_mensajes")
public class ContactoMensaje {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String nombre;
	private String correo;
	private String asunto;
	private String mensaje;
	private Instant recibidoEn;

	public ContactoMensaje() {}

	public ContactoMensaje(String nombre, String correo, String asunto, String mensaje, Instant recibidoEn) {
		this.nombre = nombre;
		this.correo = correo;
		this.asunto = asunto;
		this.mensaje = mensaje;
		this.recibidoEn = recibidoEn;
	}

	public Long getId() {
		return id;
	}

	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	public String getCorreo() {
		return correo;
	}

	public void setCorreo(String correo) {
		this.correo = correo;
	}

	public String getAsunto() {
		return asunto;
	}

	public void setAsunto(String asunto) {
		this.asunto = asunto;
	}

	public String getMensaje() {
		return mensaje;
	}

	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}

	public Instant getRecibidoEn() {
		return recibidoEn;
	}

	public void setRecibidoEn(Instant recibidoEn) {
		this.recibidoEn = recibidoEn;
	}
}