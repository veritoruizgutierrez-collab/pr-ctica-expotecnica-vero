let proyectos = JSON.parse(localStorage.getItem("proyectos")) || [];

const form = document.getElementById("formProyecto");
const tabla = document.getElementById("tabla");

const buscar = document.getElementById("buscar");
const filtroEsp = document.getElementById("filtroEsp");
const filtroCat = document.getElementById("filtroCat");

form.addEventListener("submit", e => {
  e.preventDefault();

  const p = {
    id: Date.now(),
    nombre: nombre.value,
    integrantes: integrantes.value,
    especialidad: especialidad.value,
    categoria: categoria.value,
    descripcion: descripcion.value,
    puntaje: Number(puntaje.value),
    fecha: new Date().toLocaleDateString()
  };

  if(!p.nombre || !p.integrantes || !p.especialidad || !p.categoria || !p.descripcion || !p.puntaje){
    alert("Completa todos los campos");
    return;
  }

  proyectos.push(p);
  guardar();
  render();
  form.reset();
});

function estado(p){
  if(p>=90) return "excelente";
  if(p>=80) return "muybueno";
  if(p>=70) return "bueno";
  return "proceso";
}

function textoEstado(p){
  if(p>=90) return "Excelente";
  if(p>=80) return "Muy bueno";
  if(p>=70) return "Bueno";
  return "En proceso";
}

function render(){
  tabla.innerHTML = "";

  const total = proyectos.length;
  const promedio = total
    ? (proyectos.reduce((a,b)=>a+b.puntaje,0)/total).toFixed(2)
    : 0;

  document.getElementById("total").textContent = total;
  document.getElementById("promedio").textContent = promedio;

  const b = buscar.value.toLowerCase();
  const e = filtroEsp.value.toLowerCase();
  const c = filtroCat.value.toLowerCase();

  proyectos
    .filter(p =>
      p.nombre.toLowerCase().includes(b) &&
      p.especialidad.toLowerCase().includes(e) &&
      p.categoria.toLowerCase().includes(c)
    )
    .forEach(p => {
      tabla.innerHTML += `
        <tr>
          <td>${p.nombre}</td>
          <td>${p.especialidad}</td>
          <td>${p.categoria}</td>
          <td>${p.puntaje}</td>
          <td><span class="badge ${estado(p.puntaje)}">${textoEstado(p.puntaje)}</span></td>
          <td>
            <button onclick="ver(${p.id})">Ver</button>
            <button onclick="eliminar(${p.id})">Eliminar</button>
          </td>
        </tr>
      `;
    });
}

function eliminar(id){
  proyectos = proyectos.filter(p => p.id !== id);
  guardar();
  render();
}

function ver(id){
  const p = proyectos.find(x => x.id === id);

  document.getElementById("detalle").innerHTML = `
    <b>Proyecto:</b> ${p.nombre}<br>
    <b>Integrantes:</b> ${p.integrantes}<br>
    <b>Especialidad:</b> ${p.especialidad}<br>
    <b>Categoría:</b> ${p.categoria}<br>
    <b>Descripción:</b> ${p.descripcion}<br>
    <b>Puntaje:</b> ${p.puntaje}<br>
    <b>Fecha:</b> ${p.fecha}
  `;

  document.getElementById("modal").style.display = "block";
}

function cerrarModal(){
  document.getElementById("modal").style.display = "none";
}

function guardar(){
  localStorage.setItem("proyectos", JSON.stringify(proyectos));
}

buscar.oninput = render;
filtroEsp.oninput = render;
filtroCat.oninput = render;

render();