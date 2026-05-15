package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Inscripcion;

public interface InscripcionRepository extends JpaRepository<Inscripcion, Long> {
    @Query("select i from Inscripcion i where i.evento.id = :eventoId order by i.fechaInscripcion asc")
    List<Inscripcion> buscarPorEvento(@Param("eventoId") Long eventoId);

    @Query("select i from Inscripcion i where i.participante.id = :participanteId order by i.fechaInscripcion asc")
    List<Inscripcion> buscarPorParticipante(@Param("participanteId") Long participanteId);

    @Query("select count(i) > 0 from Inscripcion i where i.evento.id = :eventoId and i.participante.id = :participanteId")
    boolean existeInscripcion(@Param("eventoId") Long eventoId, @Param("participanteId") Long participanteId);
}
