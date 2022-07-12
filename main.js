const gridForm = document.querySelector('#gridForm');
const btnIr = document.querySelector('#btnIr')
const formularioContainer = document.querySelector('#formularioContainer')
const url = "https://62ccd195a080052930b0304f.mockapi.io/gente/gente"
const pageActual = document.querySelector('#pageActual')
const pageTotal = document.querySelector('#pageTotal')

const obj = {
    tipo: "",
    page: 1,
    limit: 5,
    cantidad: ""
}


// buscar la cantidad total de elementos en el objeto 
function cantidadProductos(){
    fetch(`${url}`)
    .then(response => response.json())
    .then(data => {
        obj.cantidad = data.length
    
    })
}

btnIr.addEventListener('click', (e) =>{
    participar()
})

function participar(){
    formularioContainer.innerHTML = `
    <div class="bg">
                    <div class="bg__popUp">
                        <form class="form" action="">
                            <input id="inputNombre" placeholder="Nombre" type="text">
                            <input id="inputApellido" placeholder="Apellido" type="text">
                            <input id="inputVegetariano" placeholder="Vegetariano" type="text">
                            <input id="inputCeliaco" placeholder="Celiaco" type="text">
                            <input id="inputPago" placeholder="Pago" type="text">
                            <button class="btnSubmit"type="submit">Participar</button>
                        </form>
                        <div class="btn__popUp">
                            <button class="btnCerrar">Cancelar</button>
                        </div>
                    </div>
                </div>
    
    `
}

function editar(){
    formularioContainer.innerHTML = `
    <div class="bg">
                    <div class="bg__popUp">
                        <form id="formEditar" class="formEditar" action="">
                            <input id="inputNombre" placeholder="Nombre" type="text">
                            <input id="inputApellido" placeholder="Apellido" type="text">
                            <input id="inputVegetariano" placeholder="Vegetariano" type="text">
                            <input id="inputCeliaco" placeholder="Celiaco" type="text">
                            <input id="inputPago" placeholder="Pago" type="text">
                            <button class="btnSubmitEditar"type="submit">Editar</button>
                        </form>
                        <div class="btn__popUp">
                            <button class="btnCerrar">Cancelar</button>
                        </div>
                    </div>
                </div>
    
    `
    
}


document.addEventListener('click', (e) =>{
    if(e.target.classList.contains('btnSubmit')){
        e.preventDefault()
       if(inputNombre.value != "" || inputApellido.value != "" || inputVegetariano.value != "" || inputCeliaco.value != "" || inputPago.value != ""){
        enviarDato({nombre: inputNombre.value, apellido: inputApellido.value, vegetariano: inputVegetariano.value, celiaco: inputCeliaco.value, pago: inputPago.value})
        formularioContainer.innerHTML = ''
        Swal.fire({
            icon: 'success',
            title: 'Inscripcion enviada con exito!',
            text: 'Verifica que este en la lista de invitados.',            
          })
        }else{
        alert("no")
       }
    }
})
document.addEventListener('click', (e) =>{
    if(e.target.classList.contains('btnCerrar')){
        formularioContainer.innerHTML = ''
    }
})

function plantilla(data){
    gridForm.innerHTML = `
            <h2>Nombre</h2>
            <h2>Apellido</h2>
            <h2>Vegetariano</h2>
            <h2>Celiaco</h2>
            <h2>Pago</h2>
            <h2>Editar</h2>
            <h2>Eliminar</h2>
    `
    data.forEach(elm => {
        gridForm.innerHTML += `
        <p>${elm.nombre}</p>
        <p>${elm.apellido}</p>
        <p>${elm.vegetariano}</p>
        <p>${elm.celiaco}</p>
        <p>${elm.pago}</p>
        <button class="btnEditar" data-id="${elm.id}">Editar</button>
        <button class="btnEliminar" data-id="${elm.id}">Eliminar</button>
        `
    })
}

document.addEventListener('click', (e) =>{
    if(e.target.classList.contains('btnEditar')){
        editar()
        let id = e.target.dataset.id
        get(id)
        document.addEventListener('click', (e) =>{
            if(e.target.classList.contains('btnSubmitEditar')){
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
                        modificar(id, {nombre: formEditar.inputNombre.value, apellido: formEditar.inputApellido.value, vegetariano: formEditar.inputVegetariano.value, celiaco: formEditar.inputCeliaco.value, pago: formEditar.inputPago.value})
                        Swal.fire(
                            'Editado!',
                            'Tu proyecto ha sido editado.',
                            'success'
                            
                        )
                        formularioContainer.innerHTML = ''
                    }else{
                        formularioContainer.innerHTML = ''
                    }
                  })
            }
        })
    }
})

document.addEventListener('click', (e) =>{
    if(e.target.classList.contains('btnEliminar')){
        let id = e.target.dataset.id
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
                    
                )
                formularioContainer.innerHTML = ''
            }else{
                formularioContainer.innerHTML = ''
            }
          })
    }
})

function get(id){
    fetch(`${url}/${id}`,{
        "method" : "GET"
    })
    .then(response => response.json())
    .then(data => {
        formEditar.inputNombre.value = data.nombre
        formEditar.inputApellido.value = data.apellido
        formEditar.inputVegetariano.value = data.vegetariano
        formEditar.inputCeliaco.value = data.celiaco
        formEditar.inputPago.value = data.pago
    })
}


function imprimir(){
    fetch(`${url}?page=${obj.page}&limit=${obj.limit}`)
    .then(response => response.json())
    .then(data => {
        if(data.length != 0){
            plantilla(data)  
        }else{
            plantilla(data)  
        }
    })
    
}
imprimir()

function modificar(id, dato){
    fetch(`${url}/${id}`,{
        "method" : "PUT",
        "headers" : {"Content-Type": "application/json"},
        "body" : JSON.stringify(dato)
    })
    .then(response => response.json())
    .then(data => {
        imprimir()
    })
}

function enviarDato(obj){
    fetch(url,{
        "method" : "POST",
        "headers" : {"Content-Type": "application/json"},
        "body" : JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
        imprimir()
    })
}
function eliminar(id){
    fetch(`${url}/${id}`,{
        "method" : "DELETE"
    })
    .then(response => response.json())
    .then(data => {
        imprimir()
        cantidadProductos()
    })
}


document.addEventListener('click', (e) => {
   
    if(e.target.classList.contains('btnSumar')){
        
        let max = 1
        if(obj.cantidad >= 5){
            max = Math.ceil(obj.cantidad / 5)
        }

        if(obj.page < max){
            obj.page++
        }
        cantidadProductos()
        imprimir()

    }
})
document.addEventListener('click', (e) => {
    if(e.target.classList.contains('btnResta')){
        if(obj.page > 1){
            obj.page--
        }
        imprimir()
    }
})

cantidadProductos()