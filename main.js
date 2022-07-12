"use strict";

const gridForm = document.querySelector('#gridForm');
const tbody = document.querySelector("#la-banda");

const btnIr = document.querySelector('#btnIr')
const formularioContainer = document.querySelector('#formularioContainer')
const url = "https://62ccd195a080052930b0304f.mockapi.io/gente/gente"
const pageActual = document.querySelector('#pageActual')
const pageTotal = document.querySelector('#pageTotal')

const obj = {
    tipo: "",
    page: 1,
    limit: 5,
    cantidad: 0
}

btnIr.addEventListener('click', () => {
    participar()
})

// buscar la cantidad total de elementos en el objeto 
async function cantidadProductos() {
    try {
        let respuesta = await fetch(url);
        if (respuesta.ok) {
            let json = await respuesta.json();
            obj.cantidad = json.length;
        }

    }
    catch(error){console.log(error);}
}

function participar() { formularioContainer.appendChild(generarFormulario("participar")); }
function editar() { formularioContainer.appendChild(generarFormulario("editar")); }

function generarFormulario(valor) {
    let form = document.createElement("form");
    let btn = document.createElement("button");
    btn.setAttribute("type", "submit");
    if (valor == "participar") {
        form.setAttribute("id", "formEditar");
        form.classList.add("formEditar");
        form.addEventListener("submit",(e)=>{
            e.preventDefault();
            enviarDato({
                nombre: inputNombre.value,
                apellido: inputApellido.value,
                vegetariano: inputVegetariano.value,
                celiaco: inputCeliaco.value,
                pago: inputPago.value
            });
            formularioContainer.innerHTML = '';
            Swal.fire({
                icon: 'success',
                title: 'Inscripcion enviada con exito!',
                text: 'Verifica que este en la lista de invitados.',
            });
        })
        btn.classList.add("btnSubmit");
        btn.innerHTML = "Participar";
    }
    if (valor == "editar") {
        form.classList.add("form");
        btn.classList.add("btnSubmitEditar");
        btn.innerHTML = "Editar";
        btn.addEventListener("click",edicion)
    }
    form.innerHTML = `<input id="inputNombre" placeholder="Nombre" type="text" required>
                      <input id="inputApellido" placeholder="Apellido" type="text" required>
                      <input id="inputVegetariano" placeholder="Vegetariano" type="text" required>
                      <input id="inputCeliaco" placeholder="Celiaco" type="text" required>
                      <input id="inputPago" placeholder="Pago" type="text" required>`;
    form.appendChild(btn);
    let popUP = document.createElement("div");
    popUP.classList.add("bg__popUp");
    popUP.appendChild(form);
    let btnCerrar = document.createElement("button");
    btnCerrar.classList.add("btnCerrar");
    btnCerrar.innerHTML = "Cancelar";
    btnCerrar.addEventListener("click", () => {
        formularioContainer.innerHTML = ''
    });
    let btnPopUp = document.createElement("div");
    btnPopUp.classList.add("btn__popUp");
    btnPopUp.appendChild(btnCerrar);
    popUP.appendChild(btnPopUp);
    let div = document.createElement("div");
    div.classList.add("bg");
    div.appendChild(popUP);
    return div;
}

function plantilla(data) {
    tbody.innerHTML = "";
    let ths = document.querySelectorAll("th");
    data.forEach((elem) => {
        let valorVeg, valorCel, colorV = "red", colorC = "red";
        if(elem.vegetariano == "No" || elem.vegetariano == "no")
            valorVeg = `&cross;`;
        else{
            valorVeg = `&check;`;
            colorV = "green";
        }
        if(elem.celiaco == "No" || elem.celiaco == "no")
            valorCel = `&cross;`;
        else{
            valorCel = `&check;`;
            colorC = "green";
        }
        let fila = document.createElement("tr");
        fila.innerHTML = `<td data-label=${ths[0].innerHTML} >${elem.nombre}</td>
                          <td data-label=${ths[1].innerHTML} >${elem.apellido}</td>
                          <td data-label=${ths[2].innerHTML} style=color:${colorV} >${valorVeg}</td>
                          <td data-label=${ths[3].innerHTML} style=color:${colorC}>${valorCel}</td>
                          <td data-label=${ths[4].innerHTML} >${elem.pago}</td>
                          <td data-label=${ths[5].innerHTML} >        
                            <button class="btnEditar" data-id="${elem.id}"><img src="css/pencil.svg"></button>
                            <button class="btnEliminar" data-id="${elem.id}"><img src="css/trash.svg"></button>
                          </td>`;
        tbody.appendChild(fila);
    });
    document.querySelectorAll(".btnEditar").forEach((elem)=>{elem.addEventListener("click", btnEditar)});
    document.querySelectorAll(".btnEliminar").forEach((elem)=>{elem.addEventListener("click", btnEliminar)});
}

function btnEditar(e){
    editar();
    let elemento;
    if(e.target.dataset == null)
        elemento = e.target.parentElement;
    else
        elemento = e.target;
    get(elemento.dataset.id);
}

function edicion(e){
    e.preventDefault()
    Swal.fire({
        title: 'Estas seguro?',
        text: "No podras revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, editar!'
    }).then((result) => {
        if (result.value) {
            modificar(id, {
                nombre: formEditar.inputNombre.value,
                apellido: formEditar.inputApellido.value,
                vegetariano: formEditar.inputVegetariano.value,
                celiaco: formEditar.inputCeliaco.value,
                pago: formEditar.inputPago.value
            });
            Swal.fire(
                'Editado!',
                'Tu proyecto ha sido editado.',
                'success'
            );
            formularioContainer.innerHTML = '';
        }
        else {
            formularioContainer.innerHTML = '';
        }
    })
}

function btnEliminar(e){
    let id = e.target.dataset.id;
    Swal.fire({
        title: 'Estas seguro?',
        text: "No podras revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
        if (result.value) {
            eliminar(id)
            Swal.fire(
                'Eliminado!',
                'Tu proyecto ha sido eliminado.',
                'success'

            );
            formularioContainer.innerHTML = '';
        }
        else {
            formularioContainer.innerHTML = '';
        }
    });
}

async function get(id) {
    try{
        let respuesta = await fetch(`${url}/${id}`,{"method" : "GET"});
        if(respuesta.ok){
            let json = await respuesta.json();
            formEditar.inputNombre.value = json.nombre;
            formEditar.inputApellido.value = json.apellido;
            formEditar.inputVegetariano.value = json.vegetariano;
            formEditar.inputCeliaco.value = json.celiaco;
            formEditar.inputPago.value = json.pago;
        }
    }
    catch(error){console.log(error);}
}

async function imprimir() {
    try{
        let respuesta = await fetch(`${url}?page=${obj.page}&limit=${obj.limit}`);
        if(respuesta.ok){
            let json = await respuesta.json();
            plantilla(json);
        }
    }
    catch(error){console.log(error);}
}

async function modificar(id, dato) {
    try{
        await fetch(`${url}/${id}`,{"method": "PUT",
                                    "headers": { "Content-Type": "application/json" },
                                    "body": JSON.stringify(dato)
        });
        imprimir();
    }
    catch(error){console.log(error);}
}

async function enviarDato(obj) {
    try{
        await fetch(url,{"method": "POST",
                         "headers": { "Content-Type": "application/json" },
                         "body": JSON.stringify(obj)
        });
        imprimir();
    }
    catch(error){console.log(error);}
}

async function eliminar(id) {
    try{
        await fetch(`${url}/${id}`, {"method": "DELETE"});
        imprimir();
        cantidadProductos();
    }
    catch(error){console.log(error);}
}


document.querySelector("#btnSig").addEventListener('click', () => {
    let max = 1
    if (obj.cantidad >= 5) {
        max = Math.ceil(obj.cantidad / 5)
    }
    if (obj.page < max) {
        obj.page++
    }
    cantidadProductos()
    imprimir()
    document.querySelector("#paginado").innerHTML = `${(obj.page-1)*obj.limit}-${obj.page*obj.limit}`;
})
document.querySelector("#btnAnt").addEventListener('click', (e) => {
    if (obj.page > 1) {
        obj.page--
    }
    imprimir()
    document.querySelector("#paginado").innerHTML = `${(obj.page-1)*obj.limit}-${obj.page*obj.limit}`;
})
imprimir();
cantidadProductos();
