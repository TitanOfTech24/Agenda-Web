const API_URL = "https://script.google.com/macros/s/AKfycbwPzEPGT7H0sNuMTmUEfxKcUop8vWwCfGYAujmgW6XCrGFBqg_R7lYprrgA4WlOZN8AAQ/exec";

document.getElementById("fecha").addEventListener("change", async function () {
  const fecha = this.value;
  const tabla = document.querySelector("#tabla-turnos tbody");
  tabla.innerHTML = "";

  const response = await fetch(`${API_URL}?fecha=${fecha}`);
  const turnos = await response.json();

  if (turnos.length === 0) {
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
});

async function reservarTurno(fecha, hora) {
  const nombre = prompt("Ingresá tu nombre completo:");
  const telefono = prompt("Ingresá tu número de celular (con código de país):");

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

  const params = new URLSearchParams({ fecha, hora, nombre, telefono, tipo: tipoTexto });

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const resultado = await response.text();
  alert(resultado);

  const mensaje = `Hola ${nombre}, confirmamos tu ${tipoTexto} el ${fecha} a las ${hora} con Santiago Sierra.`;
  const whatsappURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, "_blank");
}
