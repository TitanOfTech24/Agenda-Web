
const turnos = [
  { fecha: "2025-06-20", hora: "08:00", profesional: "Juan", ocupado: false },
  { fecha: "2025-06-20", hora: "09:00", profesional: "Juan", ocupado: true },
  { fecha: "2025-06-20", hora: "10:00", profesional: "Ana", ocupado: false },
];

const tabla = document.getElementById("tabla-turnos");

turnos.forEach((t, i) => {
  const fila = document.createElement("tr");

  fila.innerHTML = `
    <td>${t.fecha}</td>
    <td>${t.hora}</td>
    <td>${t.profesional}</td>
    <td>
      <button onclick="reservar(${i})" ${t.ocupado ? "disabled" : ""}>
        ${t.ocupado ? "Ocupado" : "Reservar"}
      </button>
    </td>
  `;

  tabla.appendChild(fila);
});

function reservar(i) {
  alert(\`Solicitaste reservar el turno de \${turnos[i].hora} con \${turnos[i].profesional}\`);
}
