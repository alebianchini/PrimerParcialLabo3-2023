class Vehiculo {
    constructor(id, modelo, anoFab, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFab = anoFab;
        this.velMax = velMax;
    }

    toString() {
        return `ID: ${this.id}, modelo: ${this.modelo}, anoFab: ${this.anoFab}, VelMax: ${this.VelMax}`;
    }
}

class Aereo extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, altMax, autonomia) {
        super(id, modelo, anoFab, velMax);
        this.altMax = altMax;
        this.autonomia = autonomia;
    }

    toString() {
        return `${super.toString()}, altMax: ${this.altMax}, autonomia: ${this.autonomia}`;
    }
}

class Terrestre extends Vehiculo {
    constructor(id, modelo, anoFab, velMax, cantPue, cantRue) {
        super(id, modelo, anoFab, velMax);
        this.cantPue = cantPue;
        this.cantRue = cantRue;
    }

    toString() {
        return `${super.toString()}, cantPue: ${this.cantPue}, cantRue: ${this.cantRue}`;
    }
}

const jsonString = '[{"id":14, "modelo":"Ferrari F100", "anoFab":1998, "velMax":400, "cantPue":2, "cantRue":4},{"id":51, "modelo":"DodgeViper", "anoFab":1991, "velMax":266, "cantPue":2, "cantRue":4},{"id":67, "modelo":"Boeing CH-47 Chinook","anoFab":1962, "velMax":302, "altMax":6, "autonomia":1200},{"id":666, "modelo":"Aprilia RSV 1000 R","anoFab":2004, "velMax":280, "cantPue":0, "cantRue":2},{"id":872,"modelo":"Boeing 747-400", "anoFab":1989,"velMax":988, "altMax":13, "autonomia":13450},{"id":742, "modelo":"Cessna CH-1 SkyhookR", "anoFab":1953,"velMax":174, "altMax":3, "autonomia":870}]';
const data = JSON.parse(jsonString);
window.addEventListener("DOMContentLoaded", () => {
    //const btnCalcular = document.getElementById("btnCalcular");
    const selectTipoVehiculo = document.getElementById("selectTipoVehiculo");
    const abmTipoSelect = document.getElementById("abmTipoSelect");
    const abmSelect = document.getElementById("abmSelect");
    const abmAltMax = document.getElementById("abmAltMax");
    const abmAutonomia = document.getElementById("abmAutonomia");
    const abmCantPue = document.getElementById("abmCantPue");
    const abmCantRue = document.getElementById("abmCantRue");
    const btnCalcular = document.getElementById("btnCalcular");
    const inpVelocidadPromedio = document.getElementById("inpVelocidadPromedio");
    const formDatos = document.getElementById("formDatos");
    const formABM = document.getElementById("formABM");
    const btnAgregar = document.getElementById("btnAgregar");
    const btnAceptar = document.getElementById("btnAceptar");
    const btnCancelar = document.getElementById("btnCancelar");

    const vehichulos = listarObjetos(data);
    console.log(vehichulos);

    selectTipoVehiculo.addEventListener("change", function () {
        const tipoVehiculoSeleccionado = selectTipoVehiculo.value;
        const vehichulosFiltradas = vehichulos.filter(vehiculo => {
            if (tipoVehiculoSeleccionado === "todos") {
                return true; // Mostrar todos los vehiculos
            } else if (tipoVehiculoSeleccionado === "aereos") {
                return vehiculo instanceof Aereo; // Mostrar solo aereos
            } else if (tipoVehiculoSeleccionado === "terrestres") {
                return vehiculo instanceof Terrestre; // Mostrar solo terrestres
            }
        });
        crearTablaHTML(vehichulosFiltradas);
    });
    btnCalcular.addEventListener("click", () => {
        const data = JSON.parse(localStorage.getItem("datosActuales"));
        if (data) {
            let total = 0;
            data.map(({ velMax }) => total += velMax)
            const resultado = total / data.length;
            inpVelocidadPromedio.value = resultado;
        }
    });

    const filas = document.querySelectorAll("#divTabla table tbody tr");
    filas.forEach(fila => {
        fila.addEventListener("dblclick", (e) => {
            if (e.target.matches("td")) {
                const id = fila.firstElementChild.textContent;
                const itemLista = vehichulos.find(vehiculo => vehiculo.id === parseInt(id));
                const { inputID, inputModelo, inputAnoFab, inputVelMax, abmSelect, inputAltMax, inputAutonomia, inputCantPue, inputCantRue } = formABM;

                inputID.value = itemLista.id;
                inputModelo.value = itemLista.modelo;
                inputAnoFab.value = itemLista.anoFab;
                inputVelMax.value = itemLista.velMax;
                if (itemLista instanceof Aereo) {
                    abmSelect.value = "Aereo";
                    abmCantPue.classList.add("hide");
                    abmCantRue.classList.add("hide");

                } else if (itemLista instanceof Terrestre) {
                    abmSelect.value = "Terrestre";
                    abmAltMax.classList.add("hide");
                    abmAutonomia.classList.add("hide");
                }
                inputAltMax.value = itemLista.altMax;
                inputAutonomia.value = itemLista.autonomia;
                inputCantPue.value = itemLista.cantPue;
                inputCantRue.value = itemLista.cantRue;

                formDatos.classList.add("hide");
                formABM.classList.remove("hide");
                abmTipoSelect.classList.add("hide");
            }
        });
    });
    btnAgregar.addEventListener("click", () => {
        formDatos.classList.add("hide");
        formABM.classList.remove("hide");
        abmTipoSelect.classList.remove("hide");
    });
    btnAceptar.addEventListener("click", () => {
        formABM.classList.add("hide");
        formDatos.classList.remove("hide");
        abmCantPue.classList.remove("hide");
        abmCantRue.classList.remove("hide");
        abmAltMax.classList.remove("hide");
        abmAutonomia.classList.remove("hide");
        formABM.reset();
    });
    btnCancelar.addEventListener("click", () => {
        formABM.classList.add("hide");
        formDatos.classList.remove("hide");
        abmCantPue.classList.remove("hide");
        abmCantRue.classList.remove("hide");
        abmAltMax.classList.remove("hide");
        abmAutonomia.classList.remove("hide");
        formABM.reset();
    });

    formABM.addEventListener("submit", (e) => {
        e.preventDefault();
        const { inputID, inputModelo, inputAnoFab, inputVelMax, abmSelect, inputAltMax, inputAutonomia, inputCantPue, inputCantRue } = formABM;

        if (inputAutonomia.value === '' && inputAltMax.value === '') {
            const nuevoVehiculo = new Terrestre(inputID.value, inputModelo.value, inputAnoFab.value, inputVelMax.value, inputCantPue.value, inputCantRue.value);
            if (nuevoVehiculo.id === '') {
                nuevoVehiculo.id = Date.now();
                altaVehiculo(nuevoVehiculo, vehichulos);
            }
            else {
                //modifVehiculo(nuevoVehiculo);
            }
        }
        else if (inputCantPue.value === '' && inputCantRue.value === '') {
            const nuevoVehiculo = new Aereo(inputID.value, inputModelo.value, inputAnoFab.value, inputVelMax.value, inputAltMax.value, inputAutonomia.value);
            if (nuevoVehiculo.id === '') {
                nuevoVehiculo.id = Date.now();
                altaVehiculo(nuevoVehiculo, vehichulos);
            }
            else {
                //modifVehiculo(nuevoVehiculo);
            }
        }

        formABM.reset();
        formABM.inputID.value = '';
    })
});

function altaVehiculo(nuevoVehiculo, vehichulos) {
    vehichulos.push(nuevoVehiculo);
    listarObjetos(vehichulos);
}


/*function modifVehiculo(nuevoVehiculo, vehichulos){
    let indice = vehichulos.findIndex((vehiculo)=>{
        return vehiculo.id == nuevoVehiculo.id;
    });
    vehichulos.splice(indice, 1, nuevoAnuncio);
    listarObjetos(vehichulos);
}*/

function actualizarStorage(data) {
    localStorage.setItem("datosActuales", JSON.stringify(data));
}

function listarObjetos(data) {
    const objetos = [];

    data.forEach(item => {
        if ('altMax' in item && 'autonomia' in item) {
            const aereo = new Aereo(item.id, item.modelo, item.anoFab, item.velMax, item.altMax, item.autonomia);
            objetos.push(aereo);
        } else if ('cantPue' in item && 'cantRue' in item) {
            const terrestre = new Terrestre(item.id, item.modelo, item.anoFab, item.velMax, item.cantPue, item.cantRue);
            objetos.push(terrestre);
        } else {
            console.log(`Datos no reconocidos para el ID ${item.id}`);
        }
    });
    crearTablaHTML(objetos);
    return objetos;
}

function crearTablaHTML(data) {
    actualizarStorage(data);
    const divTabla = document.getElementById("divTabla");
    const tabla = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    // Recopila todos los nombres de las columnas
    const columnas = [];
    data.forEach(element => {
        for (const key in element) {
            if (!columnas.includes(key)) {
                columnas.push(key);
            }
        }
    });

    const cabecera = document.createElement("tr");
    columnas.forEach(columna => {
        const th = document.createElement("th");
        th.textContent = columna;
        cabecera.appendChild(th);
    });
    thead.appendChild(cabecera);
    tabla.appendChild(thead);

    data.forEach(element => {
        const tr = document.createElement("tr");
        columnas.forEach(columna => {
            const td = document.createElement("td");
            td.textContent = (element[columna] !== undefined && element[columna] !== null) ? element[columna] : "-"; // Evita valores undefined
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);
    divTabla.innerHTML = '';
    divTabla.appendChild(tabla);
}
