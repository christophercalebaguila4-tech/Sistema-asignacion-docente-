// ==========================================
// CONFIGURACIÓN GENERAL
// ==========================================

let horasTotales = 5833;

let minimoHoras = 25;

let presupuesto = 100000;

let docentes = [];

let asignaciones = [];


// ==========================================
// CAMBIAR SECCIONES
// ==========================================

function mostrarSeccion(id) {

    const secciones = document.querySelectorAll(".seccion");

    secciones.forEach(seccion => {
        seccion.classList.add("oculto");
    });

    document.getElementById(id).classList.remove("oculto");

    actualizarSistema();
}


// ==========================================
// AGREGAR DOCENTE
// ==========================================

function agregarDocente() {

    const nombre = document
        .getElementById("nombreDocente")
        .value
        .trim();

    const tipo = document
        .getElementById("tipoDocente")
        .value;

    const horasRH = Number(
        document.getElementById("horasRH").value
    );

    const compartido = document
        .getElementById("docenteCompartido")
        .checked;


    if (nombre === "") {

        alert("Escribe el nombre del docente.");

        return;
    }


    if (horasRH <= 0) {

        alert("Las horas asignadas por Recursos Humanos deben ser mayores a 0.");

        return;
    }


    // Máximo permitido para docentes A

    if (tipo === "A" && horasRH > 40) {

        alert(
            "Un docente tipo A no puede tener más de 40 horas."
        );

        return;
    }


    const docente = {

        id: Date.now(),

        nombre: nombre,

        tipo: tipo,

        horasRH: horasRH,

        horasAsignadas: 0,

        compartido: compartido

    };


    docentes.push(docente);


    document.getElementById("nombreDocente").value = "";

    document.getElementById("horasRH").value = "";

    document.getElementById("docenteCompartido").checked = false;


    actualizarSistema();
}


// ==========================================
// ASIGNAR HORAS
// ==========================================

function asignarHoras() {

    const id = Number(
        document.getElementById("docenteAsignacion").value
    );

    const asignatura = document
        .getElementById("asignatura")
        .value
        .trim();

    const horas = Number(
        document.getElementById("horasAsignar").value
    );


    const docente = docentes.find(
        d => d.id === id
    );


    if (!docente) {

        mostrarMensaje(
            "Selecciona un docente.",
            true
        );

        return;
    }


    if (asignatura === "") {

        mostrarMensaje(
            "Escribe la asignatura.",
            true
        );

        return;
    }


    if (horas <= 0) {

        mostrarMensaje(
            "Las horas deben ser mayores a cero.",
            true
        );

        return;
    }


    // ==========================================
    // NO SUPERAR HORAS AUTORIZADAS POR RH
    // ==========================================

    if (
        docente.horasAsignadas + horas >
        docente.horasRH
    ) {

        mostrarMensaje(

            `No se pueden asignar ${horas} horas. 
            Recursos Humanos autorizó solamente 
            ${docente.horasRH} horas para este docente.`,

            true
        );

        return;
    }


    // ==========================================
    // MÁXIMO DE 40 HORAS PARA TIPO A
    // ==========================================

    if (
        docente.tipo === "A" &&
        docente.horasAsignadas + horas > 40
    ) {

        mostrarMensaje(
            "El docente tipo A no puede superar las 40 horas.",
            true
        );

        return;
    }


    // ==========================================
    // ASIGNAR
    // ==========================================

    docente.horasAsignadas += horas;


    asignaciones.push({

        docenteId: docente.id,

        docente: docente.nombre,

        asignatura: asignatura,

        horas: horas,

        tipo: docente.tipo

    });


    mostrarMensaje(
        "Horas asignadas correctamente.",
        false
    );


    document.getElementById("asignatura").value = "";

    document.getElementById("horasAsignar").value = "";


    actualizarSistema();
}


// ==========================================
// MENSAJES
// ==========================================

function mostrarMensaje(texto, error) {

    const elemento =
        document.getElementById("mensajeAsignacion");

    elemento.innerHTML = `

        <div class="${error ? "alerta" : "correcto"}">

            ${texto}

        </div>

    `;
}


// ==========================================
// ACTUALIZAR TODO EL SISTEMA
// ==========================================

function actualizarSistema() {

    actualizarDocentes();

    actualizarSelectDocentes();

    actualizarAsignaciones();

    actualizarHoras();

    actualizarAlertas();

}


// ==========================================
// TABLA DE DOCENTES
// ==========================================

function actualizarDocentes() {

    const tabla =
        document.getElementById("tablaDocentes");

    tabla.innerHTML = "";


    docentes.forEach(docente => {

        let estado = "Correcto";

        if (
            docente.horasAsignadas < minimoHoras
        ) {

            estado = "⚠️ Falta alcanzar mínimo";

        }


        if (
            docente.horasAsignadas >
            docente.horasRH
        ) {

            estado = "❌ Excede horas RH";

        }


        tabla.innerHTML += `

            <tr>

                <td>${docente.nombre}</td>

                <td>${docente.tipo}</td>

                <td>${docente.horasRH}</td>

                <td>
                    ${docente.compartido ? "Sí" : "No"}
                </td>

                <td>${docente.horasAsignadas}</td>

                <td>${estado}</td>

            </tr>

        `;

    });

}


// ==========================================
// SELECT DE DOCENTES
// ==========================================

function actualizarSelectDocentes() {

    const select =
        document.getElementById("docenteAsignacion");


    select.innerHTML = `

        <option value="">
            Seleccionar docente
        </option>

    `;


    docentes.forEach(docente => {

        select.innerHTML += `

            <option value="${docente.id}">

                ${docente.nombre}
                - ${docente.tipo}

            </option>

        `;

    });

}


// ==========================================
// TABLA DE ASIGNACIONES
// ==========================================

function actualizarAsignaciones() {

    const tabla =
        document.getElementById("tablaAsignaciones");


    tabla.innerHTML = "";


    asignaciones.forEach(asignacion => {

        tabla.innerHTML += `

            <tr>

                <td>${asignacion.docente}</td>

                <td>${asignacion.asignatura}</td>

                <td>${asignacion.horas}</td>

                <td>${asignacion.tipo}</td>

            </tr>

        `;

    });

}


// ==========================================
// HORAS TOTALES
// ==========================================

function actualizarHoras() {

    let asignadas = 0;


    docentes.forEach(docente => {

        asignadas += docente.horasAsignadas;

    });


    const restantes =
        horasTotales - asignadas;


    document.getElementById(
        "horasDisponibles"
    ).textContent = horasTotales;


    document.getElementById(
        "horasAsignadas"
    ).textContent = asignadas;


    document.getElementById(
        "horasRestantes"
    ).textContent = restantes;

}


// ==========================================
// ALERTAS
// ==========================================

function actualizarAlertas() {

    const lista =
        document.getElementById("listaAlertas");

    lista.innerHTML = "";

    let contador = 0;


    docentes.forEach(docente => {

        if (
            docente.horasAsignadas <
            minimoHoras
        ) {

            const faltantes =
                minimoHoras -
                docente.horasAsignadas;


            lista.innerHTML += `

                <div class="alerta">

                    <strong>
                        ${docente.nombre}
                    </strong>

                    tiene
                    ${docente.horasAsignadas}
                    horas.

                    Le faltan
                    ${faltantes}
                    horas para alcanzar el mínimo
                    de ${minimoHoras}.

                </div>

            `;

            contador++;

        }

    });


    document.getElementById(
        "numeroAlertas"
    ).textContent = contador;


    if (contador === 0) {

        lista.innerHTML = `

            <div class="correcto">

                No hay docentes por debajo
                del mínimo establecido.

            </div>

        `;

    }

}


// ==========================================
// CONFIGURACIÓN SEGÚN PRESUPUESTO
// ==========================================

function actualizarConfiguracion() {

    presupuesto = Number(
        document.getElementById("presupuesto").value
    );


    minimoHoras = Number(
        document.getElementById("minimoHoras").value
    );


    if (presupuesto <= 0) {

        alert(
            "El presupuesto debe ser mayor a cero."
        );

        return;
    }


    if (minimoHoras < 22) {

        alert(
            "El mínimo no puede ser menor a 22 horas."
        );

        return;
    }


    actualizarSistema();


    alert(
        `Configuración actualizada.
        
        Presupuesto: $${presupuesto}
        
        Mínimo de horas: ${minimoHoras}`
    );

}


// ==========================================
// CUATRIMESTRE
// ==========================================

function cambiarCuatrimestre() {

    const cuatrimestre =
        document.getElementById(
            "cuatrimestreSeleccionado"
        ).value;


    document.getElementById(
        "resultadoCuatrimestre"
    ).innerHTML = `

        Actualmente estás consultando
        el <strong>
        ${cuatrimestre}° cuatrimestre
        </strong>.

        <br><br>

        Las horas deberán ser asignadas
        de acuerdo con la autorización
        de Recursos Humanos.

    `;

}


// ==========================================
// INICIAR SISTEMA
// ==========================================

actualizarSistema();
