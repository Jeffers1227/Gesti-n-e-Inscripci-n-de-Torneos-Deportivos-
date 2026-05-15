package com.example.demo.entity;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "inscripciones")
public class Inscripcion {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "evento_id", nullable = false)
	private Evento evento;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "participante_id", nullable = false)
	private Participante participante;

	private String equipo;
	private Instant fechaInscripcion;
	private String estado;

	public Inscripcion() {}

	public Inscripcion(Evento evento, Participante participante, String equipo, Instant fechaInscripcion, String estado) {
		this.evento = evento;
		this.participante = participante;
		this.equipo = equipo;
		this.fechaInscripcion = fechaInscripcion;
		this.estado = estado;
	}

	public Long getId() {
		return id;
	}

	public Evento getEvento() {
		return evento;
	}

	public void setEvento(Evento evento) {
		this.evento = evento;
	}

	public Participante getParticipante() {
		return participante;
	}

	public void setParticipante(Participante participante) {
		this.participante = participante;
	}

	public String getEquipo() {
		return equipo;
	}

	public void setEquipo(String equipo) {
		this.equipo = equipo;
	}

	public Instant getFechaInscripcion() {
		return fechaInscripcion;
	}

	public void setFechaInscripcion(Instant fechaInscripcion) {
		this.fechaInscripcion = fechaInscripcion;
	}

	public String getEstado() {
		return estado;
	}

	public void setEstado(String estado) {
		this.estado = estado;
	}
}