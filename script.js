const API_URL = "https://script.google.com/macros/s/AKfycby07CrRp4pWgGtnHWlQvfCM8pm-ctcCFw5bKubOLMM3UkWnPMCSRGCxEUXrZUKhYREO2A/exec";

document.getElementById("fecha").addEventListener("change", async function () {
  const fecha = this.value;
  const contenedor = document.getElementById("lista-turnos");
  contenedor.innerHTML = "";

  const response = await fetch(`${API_URL}?fecha=${fecha}`);
  const turnos = await response.json();

  if (turnos.length === 0) {
    contenedor.innerHTML = "<p>No hay turnos disponibles para esta fecha.</p>";
    return;
  }

  turnos.forEach(t => {
    const horaFormateada = new Date(`1970-01-01T${t.hora}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    const div = document.createElement("div");
    div.className = "turno";
    div.innerHTML = `
      <span>${horaFormateada}</span>
      <button onclick="reservarTurno('${t.fecha}', '${t.hora}')">Reservar</button>
    `;
    contenedor.appendChild(div);
  });
});

async function reservarTurno(fecha, hora) {
  const nombre = prompt("Ingresá tu nombre completo:");
  const telefono = prompt("Ingresá tu número de celular (con código de país):");
  const tipoConsulta = prompt("Tipo de consulta:\n1 - Evaluación Inicial\n2 - Sesión de tratamiento");

  let tipo;
  if (tipoConsulta === "1") tipo = "Evaluación Inicial";
  else if (tipoConsulta === "2") tipo = "Sesión de tratamiento";
  else {
    alert("Selección inválida. Intente nuevamente.");
    return;
  }

  if (!nombre || !telefono) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const params = new URLSearchParams({ fecha, hora, nombre, telefono, tipo });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const resultado = await response.text();
  alert(resultado);

  const mensaje = `Hola ${nombre}, confirmamos tu ${tipo} para el ${fecha} a las ${hora} con Santiago Sierra.`;
  const whatsappURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, "_blank");
}
