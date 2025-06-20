const turnos = [
  { fecha: "2025-06-21", hora: "10:00", ocupado: false },
  { fecha: "2025-06-21", hora: "11:00", ocupado: true },
  { fecha: "2025-06-21", hora: "12:00", ocupado: false }
];

const formsBaseURL = "https://forms.office.com/Pages/ResponsePage.aspx?id=yDY_H864YEK7LIsSHgEyqhFzcy0O6J5Dsxa0oIPDhi1UMzAwUUM5UTUwM1ZRQUtKSVJCNzUyMTI1SS4u"; // Reemplazar con tu URL real

const tabla = document.getElementById("tabla-turnos");

turnos.forEach((t) => {
  const fila = document.createElement("tr");
  const linkConParametros = `${formsBaseURL}?fecha=${t.fecha}&hora=${t.hora}`;

  fila.innerHTML = `
    <td>${t.fecha}</td>
    <td>${t.hora}</td>
    <td>
      <a href="${linkConParametros}" target="_blank">
        <button ${t.ocupado ? "disabled" : ""}>
          ${t.ocupado ? "Ocupado" : "Reservar"}
        </button>
      </a>
    </td>
  `;

  tabla.appendChild(fila);
});
