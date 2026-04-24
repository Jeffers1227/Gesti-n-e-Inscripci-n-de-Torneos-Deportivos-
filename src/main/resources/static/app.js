// Gestor de Torneos Deportivos - Lógica de aplicación

const API_URL = "http://localhost:8090";

// ============ FUNCIONES GENERALES ============
function switchTab(tabName) {
  // Ocultar todas las pestañas
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Desactivar todos los botones
  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.classList.remove("active");
  });

  // Mostrar la pestaña seleccionada
  document.getElementById(tabName).classList.add("active");

  // Activar el botón correspondiente
  event.target.classList.add("active");
}

function showMessage(elementId, message, type) {
  const element = document.getElementById(elementId);
  element.innerHTML = `<div class="${type}">${message}</div>`;
  setTimeout(() => {
    element.innerHTML = "";
  }, 5000);
}

// ============ FUNCIONES PARA EVENTOS ============
async function crearEvento(e) {
  e.preventDefault();
  const evento = {
    fecha: document.getElementById("eventoFecha").value,
    hora: document.getElementById("eventoHora").value,
    lugar: document.getElementById("eventoUbicacion").value,
    descripcion: document.getElementById("eventoDescripcion").value,
    capacidadMaxima: parseInt(document.getElementById("eventoCapacidad").value) || 20,
  };

  try {
    const response = await fetch(`${API_URL}/eventos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(evento),
    });

    if (response.ok) {
      showMessage("eventoMessage", "Evento creado exitosamente", "success");
      document.querySelector("form").reset();
      listarEventos();
    } else {
      showMessage("eventoMessage", "Error al crear el evento", "error");
    }
  } catch (error) {
    showMessage(
      "eventoMessage",
      "Error de conexión: " + error.message,
      "error"
    );
  }
}

async function listarEventos() {
  try {
    const response = await fetch(`${API_URL}/eventos`);
    const eventos = await response.json();

    let html = "";
    eventos.forEach((evento) => {
      html += `
        <div class="result-item">
          <h3>${evento.descripcion || "Evento"}</h3>
          <p><strong>ID:</strong> ${evento.id}</p>
          <p><strong>Fecha:</strong> ${evento.fecha}</p>
          <p><strong>Hora:</strong> ${evento.hora}</p>
          <p><strong>Lugar:</strong> ${evento.lugar}</p>
          <p><strong>Capacidad:</strong> ${evento.capacidadMaxima}</p>
          <button class="delete-btn" onclick="eliminarEvento(${evento.id})">Eliminar</button>
        </div>
      `;
    });

    document.getElementById("eventosList").innerHTML =
      html || "<p>No hay eventos registrados</p>";
  } catch (error) {
    document.getElementById("eventosList").innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function buscarEventosPorFecha() {
  const fecha = document.getElementById("searchFecha").value;
  if (!fecha) {
    alert("Selecciona una fecha");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/eventos/fecha/${fecha}`);
    const eventos = await response.json();

    let html = "";
    eventos.forEach((evento) => {
      html += `
        <div class="result-item">
          <h3>${evento.descripcion || "Evento"}</h3>
          <p><strong>ID:</strong> ${evento.id}</p>
          <p><strong>Fecha:</strong> ${evento.fecha}</p>
          <p><strong>Hora:</strong> ${evento.hora}</p>
          <p><strong>Lugar:</strong> ${evento.lugar}</p>
        </div>
      `;
    });

    document.getElementById("eventosSearchList").innerHTML =
      html || "<p>No hay eventos en esa fecha</p>";
  } catch (error) {
    document.getElementById("eventosSearchList").innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function eliminarEvento(id) {
  if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
    try {
      const response = await fetch(`${API_URL}/eventos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        listarEventos();
        showMessage("eventoMessage", "Evento eliminado exitosamente", "success");
      } else {
        alert("Error al eliminar el evento");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
}

// ============ FUNCIONES PARA PARTICIPANTES ============
async function crearParticipante(e) {
  e.preventDefault();
  const participante = {
    nombre: document.getElementById("participanteNombre").value,
    correo: document.getElementById("participanteEmail").value,
    telefono: document.getElementById("participanteTelefono").value,
    categoria: document.getElementById("participanteCategoria").value || "GENERAL",
  };

  try {
    const response = await fetch(`${API_URL}/participantes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(participante),
    });

    if (response.ok) {
      showMessage(
        "participanteMessage",
        "Participante creado exitosamente",
        "success"
      );
      document.querySelector("#participantes form").reset();
      listarParticipantes();
    } else {
      showMessage(
        "participanteMessage",
        "Error al crear el participante",
        "error"
      );
    }
  } catch (error) {
    showMessage(
      "participanteMessage",
      "Error de conexión: " + error.message,
      "error"
    );
  }
}

async function listarParticipantes() {
  try {
    const response = await fetch(`${API_URL}/participantes`);
    const participantes = await response.json();

    let html = "";
    participantes.forEach((participante) => {
      html += `
        <div class="result-item">
          <h3>${participante.nombre}</h3>
          <p><strong>ID:</strong> ${participante.id}</p>
          <p><strong>Correo:</strong> ${participante.correo}</p>
          <p><strong>Teléfono:</strong> ${participante.telefono}</p>
          <p><strong>Categoría:</strong> ${participante.categoria}</p>
          <button class="delete-btn" onclick="eliminarParticipante(${participante.id})">Eliminar</button>
        </div>
      `;
    });

    document.getElementById("participantesList").innerHTML =
      html || "<p>No hay participantes registrados</p>";
  } catch (error) {
    document.getElementById("participantesList").innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function eliminarParticipante(id) {
  if (
    confirm("¿Estás seguro de que deseas eliminar este participante?")
  ) {
    try {
      const response = await fetch(`${API_URL}/participantes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        listarParticipantes();
        showMessage("participanteMessage", "Participante eliminado exitosamente", "success");
      } else {
        alert("Error al eliminar el participante");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
}

// ============ FUNCIONES PARA INSCRIPCIONES ============
async function crearInscripcion(e) {
  e.preventDefault();
  const inscripcion = {
    participanteId: document.getElementById("inscripcionParticipanteId").value,
    eventoId: document.getElementById("inscripcionEventoId").value,
    equipo: document.getElementById("inscripcionEquipo").value,
  };

  try {
    const response = await fetch(`${API_URL}/inscripciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inscripcion),
    });

    if (response.ok) {
      showMessage(
        "inscripcionMessage",
        "Inscripción creada exitosamente",
        "success"
      );
      document.querySelector("#inscripciones form").reset();
      listarInscripciones();
    } else {
      showMessage(
        "inscripcionMessage",
        "Error al crear la inscripción",
        "error"
      );
    }
  } catch (error) {
    showMessage(
      "inscripcionMessage",
      "Error de conexión: " + error.message,
      "error"
    );
  }
}

async function listarInscripciones() {
  try {
    const response = await fetch(`${API_URL}/inscripciones`);
    const inscripciones = await response.json();

    let html = "";
    inscripciones.forEach((inscripcion) => {
      html += `
        <div class="result-item">
          <h3>Inscripción #${inscripcion.id}</h3>
          <p><strong>ID Participante:</strong> ${inscripcion.participanteId}</p>
          <p><strong>ID Evento:</strong> ${inscripcion.eventoId}</p>
          <p><strong>Equipo:</strong> ${inscripcion.equipo || "N/A"}</p>
          <p><strong>Fecha de Inscripción:</strong> ${inscripcion.fechaInscripcion || "N/A"}</p>
          <button class="delete-btn" onclick="eliminarInscripcion(${inscripcion.id})">Eliminar</button>
        </div>
      `;
    });

    document.getElementById("inscripcionesList").innerHTML =
      html || "<p>No hay inscripciones registradas</p>";
  } catch (error) {
    document.getElementById("inscripcionesList").innerHTML =
      `<div class="error">Error: ${error.message}</div>`;
  }
}

async function eliminarInscripcion(id) {
  if (confirm("¿Estás seguro de que deseas eliminar esta inscripción?")) {
    try {
      const response = await fetch(`${API_URL}/inscripciones/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        listarInscripciones();
        showMessage("inscripcionMessage", "Inscripción eliminada exitosamente", "success");
      } else {
        alert("Error al eliminar la inscripción");
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
}
