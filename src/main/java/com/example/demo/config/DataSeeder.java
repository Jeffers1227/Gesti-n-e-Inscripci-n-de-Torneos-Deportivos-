// config/DataSeeder.java
package com.example.demo.config;

import java.time.LocalDate;
import java.time.LocalTime;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.example.demo.service.CanchaService;
import com.example.demo.service.ContactoService;
import com.example.demo.service.EventoService;
import com.example.demo.service.InscripcionService;
import com.example.demo.service.ParticipanteService;
@Configuration
public class DataSeeder {

    @Bean
        @SuppressWarnings("unused")
    ApplicationRunner seed(CanchaService canchas, EventoService eventos,
                           ParticipanteService participantes,
                           InscripcionService inscripciones,
                           ContactoService contacto) {
        return args -> {
            // Canchas
            canchas.crear("Cancha Norte", "Av. Universitaria 1200", "GRASS", 80.0);
            canchas.crear("Cancha Sur",   "Jr. Los Álamos 340",    "CEMENTO", 60.0);
            canchas.crear("Cancha VIP",   "Calle Las Flores 800",  "SINTETICO", 120.0);

            // Eventos
            eventos.crear(LocalDate.of(2025, 7, 5),  LocalTime.of(9, 0),  "Cancha Norte", "Torneo apertura sub-18", 32);
            eventos.crear(LocalDate.of(2025, 7, 12), LocalTime.of(10, 0), "Cancha Sur",   "Copa institucional",     24);
            eventos.crear(LocalDate.of(2025, 7, 19), LocalTime.of(8, 30), "Cancha VIP",   "Clásico vecinal",        40);
            eventos.crear(LocalDate.of(2025, 8, 2),  LocalTime.of(15, 0), "Cancha Norte", "Liga relámpago",         16);

            // Participantes
            participantes.crear("Carlos Mendoza",  "carlos@correo.com",  "987001001", "SENIOR");
            participantes.crear("Lucía Torres",    "lucia@correo.com",   "987001002", "JUNIOR");
            participantes.crear("Miguel Ríos",     "miguel@correo.com",  "987001003", "SENIOR");
            participantes.crear("Ana Gómez",       "ana@correo.com",     "987001004", "JUNIOR");
            participantes.crear("Diego Paredes",   "diego@correo.com",   "987001005", "GENERAL");

            // Inscripciones (eventoId, participanteId)
            inscripciones.crear(1, 1);
            inscripciones.crear(1, 2);
            inscripciones.crear(2, 3);
            inscripciones.crear(2, 4);
            inscripciones.crear(3, 1);
            inscripciones.crear(3, 5);

            // Mensajes de contacto
            contacto.registrar("Roberto Salinas", "roberto@mail.com", "Consulta horarios",
                    "Quisiera saber si hay turnos disponibles los sábados por la mañana.");
            contacto.registrar("Patricia Vega",   "patricia@mail.com", "Reserva grupal",
                    "Somos un grupo de 15 personas y queremos reservar la cancha VIP para agosto.");
            contacto.registrar("Luis Castillo",   "luis@mail.com",     "Precios",
                    "¿Cuánto cuesta el alquiler por hora en días de semana?");
        };
    }
}