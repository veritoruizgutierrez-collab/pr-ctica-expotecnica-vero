let proyectos = JSON.parse(localStorage.getItem("proyectos")) || [];

/* ======================
   SOLO REGISTRO
====================== */
const form = document.getElementById("formProyecto");

if(form){
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
    localStorage.setItem("proyectos", JSON.stringify(proyectos));

    alert("Proyecto guardado");
    form.reset();
  });
}

/* ======================
   SOLO PROYECTOS
====================== */
const tabla = document.getElementById("tabla");

function estado(p){
  if(p>=90) return "excelente";
  if(p>=80) return "muybueno";
  if(p>=70) return "bueno";
  return "proceso";
}

function texto(p){
  if(p>=90) return "Excelente";
  if(p>=80) return "Muy bueno";
  if(p>=70) return "Bueno";
  return "En proceso";
}

function render(){

  if(!tabla) return;

  const buscar = document.getElementById("buscar")?.value.toLowerCase() || "";
  const esp = document.getElementById("filtroEsp")?.value.toLowerCase() || "";
  const cat = document.getElementById("filtroCat")?.value.toLowerCase() || "";

  tabla.innerHTML = "";

  let total = proyectos.length;
  let promedio = total ? (proyectos.reduce((a,b)=>a+b.puntaje,0)/total).toFixed(2) : 0;

  document.getElementById("total").textContent = total;
  document.getElementById("promedio").textContent = promedio;

  proyectos
  .filter(p =>
    p.nombre.toLowerCase().includes(buscar) &&
    p.especialidad.toLowerCase().includes(esp) &&
    p.categoria.toLowerCase().includes(cat)
  )
  .forEach(p => {
    tabla.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>${p.especialidad}</td>
        <td>${p.categoria}</td>
        <td>${p.puntaje}</td>
        <td><span class="badge ${estado(p.puntaje)}">${texto(p.puntaje)}</span></td>
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
  localStorage.setItem("proyectos", JSON.stringify(proyectos));
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

/* FILTROS */
document.addEventListener("input", render);

render();
