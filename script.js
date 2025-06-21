const API_URL = "https://script.google.com/macros/s/AKfycbyRS4hQv4cowQI9lrOTN83iUmme2GaxV2Z2bh2yUdF7vSuvO1GDbM8Ix72jNkBzsY9z-g/exec";

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

  if (!nombre || !telefono) {
    alert("Todos los campos son obligatorios.");
    return;
  }

  const params = new URLSearchParams({ fecha, hora, nombre, telefono });
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString()
  });

  const resultado = await response.text();
  alert(resultado);

  // Redirigir a WhatsApp
  const mensaje = `Hola ${nombre}, confirmamos tu turno para el ${fecha} a las ${hora} con Santiago Sierra.`;
  const whatsappURL = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
  window.open(whatsappURL, "_blank");
}
