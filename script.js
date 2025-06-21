const tabla = document.querySelector("#tabla-turnos tbody");
const inputFecha = document.getElementById("fecha");
const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrar-modal");
const formulario = document.getElementById("formulario");

let turnoSeleccionado = null;

const scriptURL = "https://script.google.com/macros/s/AKfycbyRS4hQv4cowQI9lrOTN83iUmme2GaxV2Z2bh2yUdF7vSuvO1GDbM8Ix72jNkBzsY9z-g/exec";

inputFecha.addEventListener("change", async () => {
  const fecha = inputFecha.value;
  if (!fecha) return;

  tabla.innerHTML = "<tr><td colspan='2'>Cargando...</td></tr>";

  const res = await fetch(`${scriptURL}?fecha=${fecha}`);
  const turnos = await res.json();

  if (turnos.length === 0) {
    tabla.innerHTML = "<tr><td colspan='2'>No hay turnos disponibles</td></tr>";
    return;
  }

  tabla.innerHTML = "";
  turnos.forEach((t) => {
    const fila = document.createElement("tr");
    const btn = document.createElement("button");
    btn.textContent = "Reservar";
    btn.onclick = () => {
      turnoSeleccionado = { ...t };
      modal.style.display = "block";
    };

    fila.innerHTML = `<td>${t.hora}</td>`;
    const tdAccion = document.createElement("td");
    tdAccion.appendChild(btn);
    fila.appendChild(tdAccion);

    tabla.appendChild(fila);
  });
});

cerrarModal.onclick = () => {
  modal.style.display = "none";
};

formulario.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const telefono = document.getElementById("telefono").value;
  const { fecha, hora } = turnoSeleccionado;

  // POST al Apps Script
  const body = new URLSearchParams({
    fecha,
    hora,
    nombre,
    telefono
  });

  await fetch(scriptURL, {
    method: "POST",
    body
  });

  // Enviar mensaje por WhatsApp
  const mensaje = `Hola, soy ${nombre}. Reservé el turno del ${formatearFecha(fecha)} a las ${hora}. ¡Gracias!`;
  const linkWA = `https://wa.me/${telefono.replace(/\D/g, "")}?text=${encodeURIComponent(mensaje)}`;
  window.open(linkWA, "_blank");

  modal.style.display = "none";
  inputFecha.dispatchEvent(new Event("change")); // refrescar
});

function formatearFecha(fechaStr) {
  const fecha = new Date(fechaStr);
  return fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
