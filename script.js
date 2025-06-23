const API_URL = "https://script.google.com/macros/s/AKfycbzoC_s10DZrLK_ay0GgycPjw3Tz7X2PCW3oBQWvRYb8J27VK9Tz8fF6t16Q3bempfOr0Q/exec";

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
    const horaFormateada = t.hora.toString().substring(0,5); // Formato HH:MM

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${horaFormateada}</td>
      <td><button onclick="reservarTurno('${t.fecha}', '${horaFormateada}')">Reservar</button></td>
    `;
    tabla.appendChild(fila);
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
