const API_URL = "https://script.google.com/macros/s/AKfycby_nZIOTaZZT8oBTXehghQs3RWMI9djBtx5N3jQxHzjNjAynTGTMTM1oWVK-ZJ-e_9ZmQ/exec";

document.getElementById("fecha").addEventListener("change", async function () {
  const fecha = this.value;
  const tabla = document.querySelector("#tabla-turnos tbody");
  tabla.innerHTML = ""; // Limpia la tabla completamente

  try {
    const response = await fetch(`${API_URL}?fecha=${fecha}`);
    const turnos = await response.json();

    if (!turnos || turnos.length === 0) {
      tabla.innerHTML = "<tr><td colspan='2'>No hay turnos disponibles para esta fecha.</td></tr>";
      return;
    }

    turnos.forEach(t => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${t.hora}</td>
        <td><button onclick="reservarTurno('${t.fecha}', '${t.hora}')">Reservar</button></td>
      `;
      tabla.appendChild(fila);
    });

  } catch (error) {
    tabla.innerHTML = "<tr><td colspan='2'>Error al cargar los turnos. Intente nuevamente.</td></tr>";
    console.error("Error al obtener los turnos:", error);
  }
});

async function reservarTurno(fecha, hora) {
  const nombre = prompt("Ingresá tu nombre completo:");
  const telefono = prompt("Ingresá tu número de celular. Ej: 099123123");

  const tipoConsulta = prompt("Seleccioná tipo de consulta:\n1. Evaluación Inicial\n2. Sesión de tratamiento");
  let tipoTexto = "";

  if (tipoConsulta === "1") tipoTexto = "Evaluación Inicial";
  else if (tipoConsulta === "2") tipoTexto = "Sesión de tratamiento";
  else {
    alert("Debes seleccionar una opción válida.");
    return;
  }

  if (!nombre || !telefono) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const params = new URLSearchParams({
    fecha,
    hora,
    nombre,
    telefono,
    tipo: tipoTexto
  });

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString()
    });

    const resultado = await response.text();
    alert(resultado);

    // Ya no redirigimos a WhatsApp porque ahora el mensaje se genera desde Google Sheets
  } catch (error) {
    alert("Hubo un error al reservar el turno. Intente nuevamente.");
    console.error("Error en la reserva:", error);
  }
}

