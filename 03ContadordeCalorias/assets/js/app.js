var btnActualizar = document.querySelector("#actualizar");

var tConsumidas = document.querySelector("#tConsumidas");
var tEjercicio = document.querySelector("#tEjercicio");
var tDiferencia = document.querySelector("#tDiferencia");


const guardarCalorias = async() => {
    let categoria = document.getElementById("categoria").value;
    let actividad = document.getElementById("actividad").value;
    let calorias = parseInt(document.getElementById("calorias").value);

    if (actividad.trim() === "" || isNaN(calorias) || calorias <= 0) {
        Swal.fire({icon: "error", title: "ERROR", text: "TIENES CAMPOS VACÍOS O LAS CALORÍAS NO SON VÁLIDAS"});
        return;
    }

    let datos=new FormData();
    datos.append("categoria",categoria);
    datos.append("actividad",actividad);
    datos.append("caloria",calorias);
    datos.append("action","addCa");
    
    let respuesta=await fetch("assets/php/metodosCa.php",{method:'POST',body:datos});
    let json=await respuesta.json();
    

    if(json.success==true){

    Swal.fire({icon: "success", title: "INFORMACIÓN REGISTRADA", text: "LA INFORMACIÓN FUE REGISTRADA CORRECTAMENTE"});
    bootstrap.Modal.getInstance(document.getElementById("nuevaCaloria")).hide();

    document.getElementById("categoria").selectedaIndex = 0;
    document.getElementById("actividad").value = "";
    document.getElementById("calorias").value = "1";

    }else{
        Swal.fire({icon: "error", title: "ERROR AL REGISTRAR"});
    }
   
    mostrarCalorias();
};



const mostrarCalorias = async() => {

    let totalConsumidas = 0;
    let totalEjercicio = 0;

    let datos2 = new FormData();
    datos2.append("action", "selectAll");
    let respuesta = await fetch("assets/php/metodosCa.php", { method: 'POST', body: datos2 });
    let res = await respuesta.json();

    let caloriasHTML = ``;
   
   res.forEach((c => {
        caloriasHTML += `
        <div class="card text-center w-75 m-auto mt-3 shadow p-2">
            <div class="row">
            <div class="col">
            
            <h5 id="ca"><b>${c.categoria.toUpperCase()}</b></h5>

            <img src="assets/img/calorias.jpg" class="imgCaloria mt-2"></div>
                <div class="col text-center">
                    <h5 id="c1"><b>ACTIVIDAD </b></h5>  <h6>${c.actividad}</h6>
                    <h5 id="c2"><b>CALORÍAS </b></h5>  <h6>${c.caloria}</h6> 
                </div>
                <div class="col">
                    <button class="btn btn-info mb-2 d-block" onclick="mostrarC(${c.id_ca})" data-bs-toggle="modal" data-bs-target="#editarCaloria">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5  15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                        </svg>
                    </button>
                    <button class="btn btn-danger mb-2 d-block" onclick="delCalorias(${c.id_ca})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                            <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                        </svg>
                    </button>
                </div>
            </div>  
            </div>  
        `;

       // Actualiza los totales
if (c.categoria === "ejercicio") {
    totalEjercicio += parseInt(c.caloria, 10) || 0;
} else {
    totalConsumidas += parseInt(c.caloria, 10) || 0;
}

    }));

    document.getElementById("listaCalorias").innerHTML = caloriasHTML;
    imprimirInfo(totalConsumidas, totalEjercicio);
};



// Función para imprimir la información de calorías
const imprimirInfo = (consumidas, ejercicio) => {
    let diferencia = consumidas - ejercicio;

    tConsumidas.innerHTML = `${consumidas}`;
    tEjercicio.innerHTML = `${ejercicio}`;
    tDiferencia.innerHTML = `${diferencia}`;
};




const mostrarC=async(index)=> {
    let datos=new FormData();
datos.append("id",index);
datos.append('action','select');

let respuesta=await fetch("assets/php/metodosCa.php",{method:'POST',body:datos});
let json=await respuesta.json();

document.getElementById("ecategoria").value=json.categoria;
document.getElementById("eactividad").value=json.actividad;
document.getElementById("ecalorias").value=json.caloria;
document.getElementById("eindex").value=json.id_ca;
}


// Función para actualizar un registro
btnActualizar.onclick = async() => {

    let categoria = document.getElementById("ecategoria").value;
    let actividad = document.getElementById("eactividad").value;
    let caloria = parseInt(document.getElementById("ecalorias").value);
    let index = parseInt(document.getElementById("eindex").value);

    if (categoria.trim() === "" || actividad.trim() === "" || isNaN(caloria) || caloria <= 0 || isNaN(index)) {
        Swal.fire({icon: "error", title: "ERROR", text: "DATOS INCORRECTOS"});
        return;
    }

    let datos=new FormData();
    datos.append("id",index);
    datos.append("categoria",categoria);
    datos.append("actividad",actividad);
    datos.append("caloria",caloria);
    datos.append('action','update');
    

    let respuesta=await fetch("assets/php/metodosCa.php",{method:'POST',body:datos});
    let json=await respuesta.json();
    
    if(json.success==true){
        Swal.fire({icon: "success", title: "INFORMACIÓN ACTUALIZADA", text: "LA INFORMACIÓN FUE ACTUALIZADA CORRECTAMENTE"});
        bootstrap.Modal.getInstance(document.getElementById("editarCaloria")).hide();
    }else{
        Swal.fire({ title: "ERROR",text: json.mensaje,icon: "error"
        });
    }
  
    mostrarCalorias();
};


// Función para eliminar un registro
function delCalorias(index) {
    Swal.fire({
        icon:"question",
        title: "¿Estás seguro de eliminar este registro?",
        showDenyButton: true,
        confirmButtonText: "Si, eliminar",
        denyButtonText: "No estoy seguro"
    }).then(async(result) => {
        if (result.isConfirmed) {

            let datos=new FormData();
            datos.append("id",index);
            datos.append("action","delete");
            
            const respuesta=await fetch("assets/php/metodosCa.php",{method:'POST',body:datos});
            let json=await respuesta.json();
            if(json.success==true){
                Swal.fire("El registro se eliminó exitosamente", "", "success");
            }else{
                Swal.fire("Error al eliminar", "", "error");
            }
            mostrarCalorias();
           
        }
    });
}

// Mostrar calorías al cargar la página
mostrarCalorias();
