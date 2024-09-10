var tPresupuesto = parseInt(localStorage.getItem("presupuesto")); // VARIABLE DE TOTAL DE PRESUPUESTO
var gastos = JSON.parse(localStorage.getItem("gastos")) || [];

var divPresupuesto = document.querySelector("#divPresupuesto");
var presupuesto = document.querySelector("#presupuesto");
var btnPresupuesto = document.querySelector("#btnPresupuesto");
var btnActualizar=document.querySelector("#actualizar");
var divGastos = document.querySelector("#divGastos");
var progress = document.querySelector("#progress");

var tGastos=0;
var disponible=0;
let index;


const inicio =()=>{
    tPresupuesto=parseInt(localStorage.getItem("presupuesto"));
    if (tPresupuesto>0) {
        divPresupuesto.classList.remove("d-block");
        divGastos.classList.remove("d-none");
        divPresupuesto.classList.add("d-none");
        divGastos.classList.add("d-block");
        totalPresupuesto.innerHTML=`$ ${tPresupuesto.toFixed(2)}`;
        mostrarGastos();
    }else{
        divPresupuesto.classList.remove("d-none");
        divGastos.classList.remove("d-block");
        divPresupuesto.classList.add("d-block");
        divGastos.classList.add("d-none");
        presupuesto.value=0;
    }
    imprimirInfo();
}




/*EVENTO ON CLICK BOTÓN INICIAR*/ 
btnPresupuesto.onclick=()=>{
tPresupuesto=parseInt(presupuesto.value);
if(tPresupuesto==0 || tPresupuesto<0 || isNaN(tPresupuesto)){
    Swal.fire({icon:"error",title:"ERROR",text:"EL PRESUPUESTO ES INVÁLIDO"});
 return;
}

        localStorage.setItem('presupuesto', tPresupuesto);
        
/*BLOQUE QUE SIRVE PARA QUE AL APRETAR BOTÓN INICIAR (SI PRESUPUESTO ES MAYOR A 0)
 DESAPAREZCAN LOS DIVS DE PRESUPUESTO Y GASTO*/

divPresupuesto.classList.remove("d-block");
divGastos.classList.remove("d-none");
divPresupuesto.classList.add("d-none");
divGastos.classList.add("d-block");

totalPresupuesto.innerHTML=`$${tPresupuesto.toFixed(2)}`;
/*document.getElementById('totalPresupuesto').textContent =  "$" +tPresupuesto.toFixed(2);DIEGO SOLUCIÓN*/


    mostrarGastos();

}

/*BLOQUE REGISTRA LOS DATOS QUE SE INGRESEN EN MODAL Y LOS GUARDA LOCALMENTE */
const guardarGasto = async() => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];
    let descripcion = document.getElementById("descripcion").value;
    let costo = parseInt(document.getElementById("costo").value);
    let categoria = document.getElementById("categoria").value;

    if (descripcion.trim() === "" || isNaN(costo) || costo <= 0) {
        Swal.fire({icon: "error", title: "ERROR", text: "TIENES CAMPOS VACÍOS O EL COSTO NO ES VÁLIDO"});
        return;
    }

    if (costo > disponible) {
        Swal.fire({icon: "error", title: "ERROR", text: "FONDOS INSUFICIENTES"});
        return;
    }

    let datos=new FormData();
    datos.append("descripcion",descripcion);
    datos.append("costo",costo);
    datos.append("categoria", categoria);
    datos.append("action","add");
    
    let respuesta=await fetch("assets/php/metodosC.php",{method:'POST',body:datos});
    let json=await respuesta.json();
    


    if(json.success==true){

        const gasto = { descripcion, costo, categoria };
        gastos.push(gasto);
        localStorage.setItem("gastos", JSON.stringify(gastos));

    Swal.fire({icon: "success", title: "GASTO REGISTRADO", text: "EL GASTO FUE REGISTRADO CORRECTAMENTE"});
    bootstrap.Modal.getInstance(document.getElementById("nuevoGasto")).hide();

    document.getElementById("descripcion").value = "";
    document.getElementById("costo").value = "";
    document.getElementById("categoria").selectedIndex = 0;
}else{
  Swal.fire({icon: "error", title: "ERROR AL REGISTRAR"});
}

mostrarGastos();
}



    // Añadimos un escuchador de eventos al elemento con id "filtrarCategoria"
    document.getElementById("filtrarCategoria").addEventListener("change", (event) => {
        // Cuando el evento "change" ocurre, obtenemos el valor seleccionado del elemento
        const categoriaSeleccionada = event.target.value;
        // Llamamos a la función mostrarGastos pasando el valor seleccionado como argumento
        mostrarGastos(categoriaSeleccionada);
    });


// Función para mostrar los gastos, con una categoría opcional para filtrar
const mostrarGastos = async(categoria = "todos") => {
    try {
        const datos2 = new FormData();
        datos2.append("action", "selectAll");
        let respuesta = await fetch("assets/php/metodosC.php", { method: 'POST', body: datos2 });
        let json = await respuesta.json();

        gastos = JSON.parse(localStorage.getItem("gastos")) || [];
        let gastosHTML = ``;

        if (json.data.length === 0) {
            document.getElementById('listaGastos').innerHTML = `<b>No hay gastos</b>`;
            tGastos = 0; // Asegúrate de resetear tGastos si no hay gastos
            imprimirInfo(); // Actualiza la información
            return;
        }

        index = 0;
        tGastos = 0;

        json.data.forEach(gasto => {
            if (categoria === gasto[3] || categoria === "todos") {
                gastosHTML += `
                    <div class="card text-center w-75 m-auto mt-3 shadow p-2 " >
                        <div class="row">
                            <div class="col"><img src="assets/img/${gasto[3]}.png" class="imgCategoria"></div>
                            <div class="col text-start">
                                <p><b>DESCRIPCIÓN: </b><small>${gasto[1]}</small></p>
                                <p><b>COSTO: </b><small>$${parseFloat(gasto[2]).toFixed(2)}</small></p>
                            </div>
                            <div class="col">
                                <button class="btn btn-info mb-2" onclick="mostrarG(${gasto[0]})" data-bs-toggle="modal" data-bs-target="#editarGasto">Update 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg></button>
                                <button class="btn btn-danger mb-2" onclick="delGastos(${gasto[0]})">Delete 
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                    </svg>
                                </button>
                            </div>
                        </div>  
                    </div>
                `;
                tGastos += parseFloat(gasto[2]);
            }
        });

        document.getElementById("listaGastos").innerHTML = gastosHTML;
        imprimirInfo(); // Recalcula y actualiza la información
    } catch (ex) {
        alert(ex);
    }
};





/*ESTE CÓDIGO IMPRIME INFORMACIÓN DEL PRESUPUESTO, DISPONIBLE, GASTADO Y CALCULA PORCENTAJE TOTAL 
CON BASE EN GASTOS Y LOS MANDA A CIRCLE-PROGRESS Y A ETIQUETAS CORRESPONDIENTES */
const imprimirInfo = async () => {
    var totalPresupuesto = document.querySelector("#totalPresupuesto");
    var totalDisponible = document.querySelector("#totalDisponible");
    var totalGastos = document.querySelector("#totalGastos");
    var tPresupuesto = parseFloat(localStorage.getItem("presupuesto")) || 0;
    disponible = tPresupuesto - tGastos;

    let porcentaje = 100 - ((tGastos / tPresupuesto) * 100);
    porcentaje = Math.max(porcentaje, 0);
    
    if (progress) {
        progress.setAttribute('value', porcentaje);
    }
    totalGastos.innerHTML = `$${tGastos.toFixed(2)}`;
    totalPresupuesto.innerHTML = `$${tPresupuesto.toFixed(2)}`;
    totalDisponible.innerHTML = `$${disponible.toFixed(2)}`;
};




/*BLOQUE QUE MUESTRA LOS DATOS REGISTRADOS EN LOCAL AL DARLE CLICK PARA QUE SE  MUESTREN EN MODAL*/
const mostrarG=async(id)=>{

let datos=new FormData();
datos.append("id",id);
datos.append('action','select');

let respuesta=await fetch("assets/php/metodosC.php",{method:'POST',body:datos});
let json=await respuesta.json();

document.getElementById("edescripcion").value=json.descripcion;
document.getElementById("ecosto").value=json.costo;
document.getElementById("ecategoria").value=json.categoria;
document.getElementById("eindex").value=json.id;
}


btnActualizar.onclick =async () => {
    gastos = JSON.parse(localStorage.getItem("gastos")) || [];

    let descripcion = document.getElementById("edescripcion").value;
    let costo = parseFloat(document.getElementById("ecosto").value);
    let categoria = document.getElementById("ecategoria").value;
    let id = parseInt(document.getElementById("eindex").value);

    if (descripcion.trim() === "" || isNaN(costo) || costo <= 0) {
        Swal.fire({icon: "error", title: "ERROR", text: "DATOS INCORRECTOS"});
        return;
    }

    let costoAnterior = parseFloat(gastos[index].costo);
    if (costo > (costoAnterior + disponible)) {
        Swal.fire({icon: "error", title: "ERROR", text: "YA NO TIENES FONDOS"});
        return;
    }

    let datos=new FormData();
    datos.append("id",id);
    datos.append("descripcion",descripcion);
    datos.append("costo",costo);
    datos.append("categoria",categoria);
    datos.append('action','update');
    

    let respuesta=await fetch("assets/php/metodosC.php",{method:'POST',body:datos});
    let json=await respuesta.json();
    
    if(json.success==true){
        Swal.fire({title: "¡ACTUALIZACIÓN ÉXITOSA!",text: json.mensaje,icon: "success"});
    }else{
        Swal.fire({ title: "ERROR",text: json.mensaje,icon: "error"
        });
    }

    Swal.fire({icon: "success", title: "¡GASTO ACTUALIZADO EXITOSAMENTE!", text: "EL GASTO FUE ACTUALIZADO CORRECTAMENTE"});
    bootstrap.Modal.getInstance(document.getElementById("editarGasto")).hide();
    mostrarGastos();
}




/*BLOQUE PARA BORRAR DEL LOCAL UN REGISTRO */
const delGastos= async(index) => {
    Swal.fire({
        icon:"question",
        title: "¿Estás seguro de eliminar este gasto?",
        showDenyButton: true,
        confirmButtonText: "Si, eliminar",
        denyButtonText: "No estoy seguro"

    }).then(async(result) => {

        if (result.isConfirmed) {
            let gastoid = new FormData();
            gastoid.append('id', index);
            gastoid.append('action','delete');

            let respuesta = await fetch("assets/php/metodosC.php", {method: 'POST',body: gastoid});
            let json = await respuesta.json();

            if (json.success == true) {
                Swal.fire("EL GASTO SE ELIMINÓ", "", "success");
            }else{
                Swal.fire({
                    title: "ERROR", text: json.mensaje, icon: "error"});
            }
            Swal.fire("EL REGISTRO SE ELIMINÓ EXITOSAMENTE", "", "success");
            mostrarGastos();
            imprimirInfo();
           
        }
    });
}



const reset=()=>{
    localStorage.clear();
    Swal.fire({icon:"success",title:"RESET",text:"LOS GASTOS SE HAN RESETADO CORRECTAMENTE"});
    inicio();
}