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
            var evento1 = eventos.crear(LocalDate.of(2025, 7, 5),  LocalTime.of(9, 0),  "Cancha Norte", "Torneo apertura sub-18", 32);
            var evento2 = eventos.crear(LocalDate.of(2025, 7, 12), LocalTime.of(10, 0), "Cancha Sur",   "Copa institucional",     24);
            var evento3 = eventos.crear(LocalDate.of(2025, 7, 19), LocalTime.of(8, 30), "Cancha VIP",   "Clásico vecinal",        40);
            eventos.crear(LocalDate.of(2025, 8, 2),  LocalTime.of(15, 0), "Cancha Norte", "Liga relámpago",         16);

            // Participantes
            var participante1 = participantes.crear("Carlos Mendoza",  "carlos@correo.com",  "987001001", "SENIOR");
            var participante2 = participantes.crear("Lucía Torres",    "lucia@correo.com",   "987001002", "JUNIOR");
            var participante3 = participantes.crear("Miguel Ríos",     "miguel@correo.com",  "987001003", "SENIOR");
            var participante4 = participantes.crear("Ana Gómez",       "ana@correo.com",     "987001004", "JUNIOR");
            var participante5 = participantes.crear("Diego Paredes",   "diego@correo.com",   "987001005", "GENERAL");

            // Inscripciones (eventoId, participanteId, equipo)
            inscripciones.crear(evento1.getId(), participante1.getId(), "Equipo A");
            inscripciones.crear(evento1.getId(), participante2.getId(), "Equipo A");
            inscripciones.crear(evento2.getId(), participante3.getId(), "Equipo B");
            inscripciones.crear(evento2.getId(), participante4.getId(), "Equipo B");
            inscripciones.crear(evento3.getId(), participante1.getId(), null);
            inscripciones.crear(evento3.getId(), participante5.getId(), null);

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