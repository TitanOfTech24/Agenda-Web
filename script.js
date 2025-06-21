const tabla = document.querySelector("#tabla-turnos tbody");
const inputFecha = document.getElementById("fecha");
const modal = document.getElementById("modal");
const cerrarModal = document.getElementById("cerrar-modal");
const formulario = document.getElementById("formulario");

let turnoSeleccionado = null;

const scriptURL = "https://script.google.com/macros/s/AKfycbyoIB1TGu9Hyl4QCKLPNIGTkseRR0J0vUCU_BTVZzgcqPHL2VUv4ZWHIZQ7Z0I4_3qT5w/exec";

inputFecha.addEventListener("change", async () => {
  const fecha = inputFecha.value;
  if (!fecha) return;

  tabla.innerHTML = "<tr><td colspan='2'>Cargando...</td></tr>";

  try {
    const res = await fetch(`${scriptURL}?fecha=${fecha}`);
    const turnos = await res.json();

    console.log("Turnos recibidos:", turnos);

    if (!Array.isArray(turnos)) {
      tabla.innerHTML = "<tr><td colspan='2'>Error al leer turnos (no es lista)</td></tr>";
      return;
    }

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
  } catch (err) {
    console.error("Error al obtener turnos:", err);
    tabla.innerHTML = "<tr><td colspan='2'>Error al cargar turnos</td></tr>";
  }
});

