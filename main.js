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
    formularioContainer.appendChild(generarFormulario());
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

function generarFormulario() {
    let form = document.createElement("form");
    let btn = document.createElement("button");
    btn.setAttribute("type", "submit");
    form.setAttribute("id", "formEditar");
    form.classList.add("formEditar");
    form.addEventListener("submit",(e)=>{
        e.preventDefault();
        enviarDato({
            nombre: inputNombre.value,
            apellido: inputApellido.value,
            vegetariano: cambiar(inputVegetariano.checked),
            celiaco: cambiar(inputCeliaco.checked),
            pago: "no"
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
    form.innerHTML = `<input id="inputNombre" placeholder="Nombre" type="text" required>
                      <input id="inputApellido" placeholder="Apellido" type="text" required>
                      <div>
                        <label>¿Vegetarian@?</label>
                        <input id="inputVegetariano" placeholder="Vegetariano" type="checkbox" >
                      </div>
                      <div>
                        <label>¿Celiac@?</label>
                        <input id="inputCeliaco" placeholder="Celiaco" type="checkbox" >
                      </div>
                        `;
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
        let valorVeg, valorCel, valorPag, colorV = "red", colorC = "red", colorP = "red";
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
        if(elem.pago == "No" || elem.pago == "no")
            valorPag = "&cross;";
        else{
            valorPag = "&check;";
            colorP = "green";
        }
        let fila = document.createElement("tr");
        fila.innerHTML = `<td data-label=${ths[0].innerHTML} >${elem.nombre}</td>
                          <td data-label=${ths[1].innerHTML} >${elem.apellido}</td>
                          <td data-label=${ths[2].innerHTML} style=color:${colorV} >${valorVeg}</td>
                          <td data-label=${ths[3].innerHTML} style=color:${colorC}>${valorCel}</td>
                          <td data-label=${ths[4].innerHTML} style=color:${colorP}>${valorPag}</td>
                          <td data-label=${ths[5].innerHTML} >        
                            <button class="btnEditar" data-id=${elem.id}><i class="fa fa-pencil-alt"></i></button>
                            <button class="btnOK oculta" data-id=${elem.id}><i class="fa fa-check"></i></button>   
                            <button class="btnEliminar" data-id=${elem.id}><i class="fa fa-trash-alt"></i></button>
                          </td>`;
        tbody.appendChild(fila);
    });
    document.querySelectorAll(".btnEditar").forEach((elem)=>{elem.addEventListener("click", btnEditar)});
    document.querySelectorAll(".btnOK").forEach((elem)=>{elem.addEventListener("click", btnOk)});
    document.querySelectorAll(".btnEliminar").forEach((elem)=>{elem.addEventListener("click", btnEliminar)});
}

function btnEditar(e){
    //let id = getID(e);
    let boton = e.target;
    let fila = boton.parentElement.parentElement;
    if(e.target.innerHTML == ""){
        boton = boton.parentElement;
        fila = fila.parentElement;
    }
    for(let celda of fila.children){
        if(celda.getAttribute("data-label")!="Acciones"){
            let input = document.createElement("input");
            if(celda.getAttribute("data-label")!="Nombre"&&celda.getAttribute("data-label")!="Apellido"){
                input.setAttribute("type", "checkbox");
                input.checked = true;
                if(celda.innerHTML == "✗")
                    input.checked = false;
            }
            input.value = celda.innerHTML;
            celda.innerHTML = "";
            celda.appendChild(input);
        }
    }
    boton.classList.toggle("oculta");
    boton.nextElementSibling.classList.toggle("oculta");
}

async function btnOk(e){
    let boton = e.target;
    let fila = boton.parentElement.parentElement;
    if(e.target.innerHTML == ""){
        boton = boton.parentElement;
        fila = fila.parentElement;
    }
    let valores = {
        nombre : fila.children[0].children[0].value,
        apellido : fila.children[1].children[0].value,
        celiaco : cambiar(fila.children[2].children[0].checked),
        vegetariano : cambiar(fila.children[3].children[0].checked),
        pago : cambiar(fila.children[0].children[0].checked)
    }
    console.log(boton.dataset.id);
    try{
        await fetch(`${url}/${boton.dataset.id}`,{"method": "PUT",
                                    "headers": { "Content-Type": "application/json" },
                                    "body": JSON.stringify(valores)
        });
        boton.classList.toggle("oculta");
        boton.previousElementSibling.classList.toggle("oculta");
        imprimir();
    }
    catch(error){console.log(error);}
}

function cambiar(valor){
    if(valor)
        return "si"
    return "no"
}

function getID(e){
    if(e.target.dataset.id == null)
        return e.target.parentElement.dataset.id;
    else
        return e.target.dataset.id;
}

function btnEliminar(e){
    let id = getID(e);
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
/*
await fetch("https://62ccd195a080052930b0304f.mockapi.io/gente/gente/1",{"method": "PUT",
                                                                         "headers": { "Content-Type": "application/json" },
                                                                         "body": `{
                                                                            "nombre": "Ines",
                                                                            "apellido": "Bilbao",
                                                                            "vegetariano": "no",
                                                                            "celiaco": "si",
                                                                            "pago": "-"
                                                                         }`
});
*/

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
