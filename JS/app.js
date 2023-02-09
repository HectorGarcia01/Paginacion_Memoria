//Obteniendo valores de los elementos
const btnInicio = document.querySelector("#btnIniciar");
const btnTerminar = document.querySelector("#btnTerminar");
var TablaProcesoInicio = document.querySelector("#ListProcesosIniciados");
var TablaProcesoFin = document.querySelector("#ListProcesosTerminados");
var TablaMarcoPagina = document.querySelector("#ListMarcoPagina");
var PaginasLibresAux = document.getElementById("PaginasLibres").textContent;
var PaginasEnUsoAux = document.getElementById("PaginasEnUso").textContent;

//Variables
var array_master = [];
var ContadorProceso = 0;
var ContadorPaginas = 0;
var ContadorMarcoPagina = 0;
var PaginasLibres = 0;
var PaginasEnUso = 0;
var ContadorProcesoEliminado = 0;
var ContadorProcesoEjecucion = 0;
var ContadorProcesoEspera = 0;
var Ejecucion = "";
var Espera = "";

//Enviando el nuevo proceso a la tabla de procesos
function NuevoProceso(){
    //Validacion de los input Proceso y Tamaño de Página
    var ProcesoNuevo = document.getElementById("NuevoProceso").value;
    var TamañoPagina = document.getElementById("TamañoPagina").value;

    if (ProcesoNuevo == '' && TamañoPagina == ''){
        alert("Por favor ingresa un Proceso y asigna el Tamaño de Página");
    }
    else if(ProcesoNuevo == ''){
        alert("Por favor ingresa un Proceso");
    }
    else if(TamañoPagina == ''){
        alert("Por favor asigna el Tamaño de Página");
    }
    else if (ProcesoNuevo != '' && TamañoPagina != ''){
        if(TamañoPagina > 0 && TamañoPagina < 7){
            var array = [];
            var arr = {NombreProceso: ProcesoNuevo, TamañoPagina: TamañoPagina};
           
            array.push(arr);
            
            var estado = false;

            array_master.forEach(element1 => {
                if(element1.NombreProceso == ProcesoNuevo && element1.TamañoPagina == TamañoPagina){
                    estado = true;
                }
            });
            if(estado == true){
                alert("El proceso está repetido");
                document.getElementById("NuevoProceso").value = "";
                document.getElementById("TamañoPagina").value = "";
                return;
            }

            array_master.push(arr);

            array.forEach(element => {                
                ContadorProceso ++;
                ContadorPaginas += parseInt(TamañoPagina);
                if(ContadorPaginas <= 8){
                    IniciarProcesoEnEjecución(element.NombreProceso, element.TamañoPagina, ContadorProceso);
                }
                else{
                    IniciarProcesoEnEspera(element.NombreProceso, element.TamañoPagina, ContadorProceso);
                }
            });
            document.getElementById("NuevoProceso").value = "";
            document.getElementById("TamañoPagina").value = "";
        }
        else{
            alert("Lo siento, el tamaño de página solo puede ser del 1 al 6")
            document.getElementById("TamañoPagina").value = "";
        }
    }
}

function IniciarProcesoEnEjecución(Nombre_Proceso, Tamaño_Pagina, ContadorProceso){ //Función para Agregar un Proceso y ponerlo en ejecución
    Ejecucion = "Sí";
    Espera = "No";

    ContadorProcesoEjecucion ++;
    document.getElementById("CantidadProcesoEjecucion").innerHTML = ContadorProcesoEjecucion;
    
    var tr = document.createElement("tr");
    tr.innerHTML = ` 
        <td align=center>${ContadorProceso}</td>
        <td align=center>${Nombre_Proceso}</td>
        <td align=center>${Tamaño_Pagina}</td>
        <td class="EjecucionSi" align=center>${Ejecucion}</td>
        <td class="EsperaNo" align=center>${Espera}</td>
        <td align=center><button id="${Nombre_Proceso}" class="btnAccionTerminar" onclick="BotonDinamicoTerminarProceso(this)">TERMINAR</button></td>
    `;
    TablaProcesoInicio.appendChild(tr);
    
    for(let i = 0; i < Tamaño_Pagina; i++){
        var tr = document.createElement("tr");
        tr.id = Nombre_Proceso;
        tr.innerHTML = ` 
            <td align=center>${Nombre_Proceso}</td>
        `;
        TablaMarcoPagina.appendChild(tr);

        ContadorMarcoPagina ++;
        
        PaginasLibres = document.getElementById("PaginasLibres").innerHTML = parseInt(PaginasLibresAux) - ContadorMarcoPagina;
        PaginasEnUso = document.getElementById("PaginasEnUso").innerHTML = parseInt(PaginasEnUsoAux) + ContadorMarcoPagina;
    }
    alert("Se envió el proceso {" + Nombre_Proceso + "} a ejecución.");
}

function IniciarProcesoEnEspera(Nombre_Proceso, Tamaño_Pagina, ContadorProceso){ //Función para agregar un Proceso y ponerlo en espera
    Ejecucion = "No";
    Espera = "Sí";

    ContadorProcesoEspera ++;
    document.getElementById("CantidadProcesoEspera").innerHTML = ContadorProcesoEspera;

    ContadorPaginas -= parseInt(Tamaño_Pagina);

    var tr = document.createElement("tr");
    tr.innerHTML = ` 
        <td id="${Nombre_Proceso}" align=center>${ContadorProceso}</td>
        <td align=center>${Nombre_Proceso}</td>
        <td align=center>${Tamaño_Pagina}</td>
        <td class="EjecucionNo" align=center>${Ejecucion}</td>
        <td class="EsperaSi" align=center>${Espera}</td>
        <td align=center><button id="${Nombre_Proceso}" class="btnAccionIniciar" onclick="BotonDinamicoEjecutarProceso(this)">EJECUTAR</button></td>
    `;
    TablaProcesoInicio.appendChild(tr);
    alert("Se envió el proceso {" + Nombre_Proceso + "} a espera.");
}

function BotonDinamicoEjecutarProceso(Posicion){ //Para ejecutar un proceso que anteriormente estaba en espera desde el botón dinámico
    var id = Posicion.id;

    for(let i = 0; i<array_master.length; i++){
        if(id == array_master[i].NombreProceso){
            var ContadorProcesoAux = i + 1;
            ContadorPaginas += parseInt(array_master[i].TamañoPagina);
            if(ContadorPaginas <= 8){
                ContadorProcesoEjecucion ++;
                document.getElementById("CantidadProcesoEjecucion").innerHTML = ContadorProcesoEjecucion;
                ContadorProcesoEspera --;
                document.getElementById("CantidadProcesoEspera").innerHTML = ContadorProcesoEspera;
                TerminarProceso(Posicion);
                IniciarProcesoEnEjecución(array_master[i].NombreProceso, array_master[i].TamañoPagina, ContadorProcesoAux);
            }
            else if(PaginasLibres < array_master[i].TamañoPagina){
                alert("Lo siento no puedes ejecutar el proceso {" + array_master[i].NombreProceso + "}, su tamaño de páginas supera las páginas libres del marco de páginas.");
                ContadorPaginas -= parseInt(array_master[i].TamañoPagina);
            }
            else{
                alert("Lo siento no puedes ejecutar el proceso {" + array_master[i].NombreProceso + "}, ya que el marco de página está lleno.");
                ContadorPaginas -= parseInt(array_master[i].TamañoPagina);
            }
        }
    }
}

function BotonTerminarProceso(){ //Para terminar un proceso desde el botón principal
    //Validación del input
    var ProcesoTerminado = document.getElementById("ProcesoFin").value;
    var Comprobacion = false;
    if(ProcesoTerminado != ''){
        for(let i = 0; i<array_master.length; i++){
            if(ProcesoTerminado == array_master[i].NombreProceso){
                Comprobacion = true;
                var class_Proceso = document.getElementById(array_master[i].NombreProceso).className;
                console.log(class_Proceso);
                if(class_Proceso == 'btnAccionTerminar'){
                    TerminarProceso(document.getElementById(array_master[i].NombreProceso));
                    AddTablaProcesoEliminado(array_master[i].NombreProceso, array_master[i].TamañoPagina, i);
                }
                else{
                    alert("Lo siento, el proceso {" + array_master[i].NombreProceso + "} no puede ser terminado ya que este no se encuentra en ejecución...");
                    document.getElementById("ProcesoFin").value = "";
                }
                break;
            } 
        }
        if(Comprobacion == false){
            alert("Lo siento, el proceso {" + ProcesoTerminado + "} no está en la lista de procesos iniciados...");
            document.getElementById("ProcesoFin").value = "";
        }
    }
    else{
        alert("Por favor ingresa el nombre de proceso que quieres terminar...");
    }
}

function BotonDinamicoTerminarProceso(Posicion){ //Para eliminar la fila donde se encuentra el proceso que será terminado con el boton dinamico
    TerminarProceso(Posicion);
    const id = Posicion.id;
    for(let i = 0; i<array_master.length; i++){
        if(id == array_master[i].NombreProceso){
            AddTablaProcesoEliminado(array_master[i].NombreProceso, array_master[i].TamañoPagina, i);
        }
    }
}

function TerminarProceso(r){  //Función para eliminar el proceso con su respectiva fila
    var i = r.parentNode.parentNode.rowIndex;
    const id = r.id;
    document.getElementById("TablaProcesosIniciados").deleteRow(i);
    ContadorProcesoEjecucion --;
    document.getElementById("CantidadProcesoEjecucion").innerHTML = ContadorProcesoEjecucion;

    var ProcesosMarcoPagina = document.querySelector("#TablaMarcoPagina").children[2].children;
    var Flag = false;
    while(Flag == false){
        var ListaItems = BorrarMarcoPagina(ProcesosMarcoPagina, id);
        if(ListaItems == true){
            Flag = true;
        }
    }
}

function BorrarMarcoPagina(Tamaño, id){ //Función para eliminar el proceso del marco de pagina con sus respectivas filas
    for(let j = 0; j < Tamaño.length; j++){
        if(Tamaño[j].id == id){
            document.getElementById("ListMarcoPagina").deleteRow(j);
            ContadorPaginas --;
            ContadorMarcoPagina --;
            PaginasLibres = document.getElementById("PaginasLibres").innerHTML = PaginasLibres + 1;
            PaginasEnUso = document.getElementById("PaginasEnUso").innerHTML = PaginasEnUso - 1;
            return false;
        }
    }
    return true;
}

function AddTablaProcesoEliminado(NombreProcesoT, TamañoPaginaT, i){ //Función para agregar el proceso eliminado a la tabla de procesos terminados
    ContadorProcesoEliminado ++;
    document.getElementById("ProcesoFin").value = "";
    var tr = document.createElement("tr");
    tr.innerHTML = ` 
        <td align=center>${ContadorProcesoEliminado}</td>
        <td align=center>${NombreProcesoT}</td>
        <td align=center>${TamañoPaginaT}</td>
    `;
    TablaProcesoFin.appendChild(tr);
    alert("El proceso {" + NombreProcesoT + "} ha sido terminado...");
    var borrar_elemento = array_master.splice(i, 1);
    console.log(i);
    console.log(array_master);
    console.log(borrar_elemento);
}

//Para el boton Iniciar Proceso
btnInicio.addEventListener("click", function(){
    NuevoProceso();
});

//Para el boton Terminar Proceso
btnTerminar.addEventListener("click", function(){
    BotonTerminarProceso();
});