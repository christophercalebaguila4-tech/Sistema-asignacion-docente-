// ============================================
// CONFIGURACIÓN
// ============================================

let configuracion = JSON.parse(
    localStorage.getItem("configuracionDocentes")
) || {

    horasTotales: 5833,

    presupuesto: 100000,

    minimo: 25,

    flexible: 22,

    maxA: 40,

    maxB: 30

};


// ============================================
// DATOS
// ============================================

let docentes = JSON.parse(
    localStorage.getItem("docentes")
) || [];

let asignaturas = JSON.parse(
    localStorage.getItem("asignaturas")
) || [];

let asignaciones = JSON.parse(
    localStorage.getItem("asignaciones")
) || [];


// ============================================
// LOGIN
// ============================================

function iniciarSesion() {

    const usuario =
        document.getElementById("usuario").value.trim();

    const password =
        document.getElementById("password").value.trim();


    /*
       USUARIO DE DEMOSTRACIÓN

       Usuario:
       director

       Contraseña:
       1234
    */

    if (
        usuario === "director" &&
        password === "1234"
    ) {

        document
            .getElementById("login")
            .classList.add("oculto");

        document
            .getElementById("sistema")
            .classList.remove("oculto");

        actualizarTodo();

    } else {

        document.getElementById(
            "errorLogin"
        ).textContent =
            "Usuario o contraseña incorrectos.";

    }

}


// ============================================
// CERRAR SESIÓN
// ============================================

function cerrarSesion() {

    document
        .getElementById("sistema")
        .classList.add("oculto");

    document
        .getElementById("login")
        .classList.remove("oculto");

}


// ============================================
// NAVEGACIÓN
// ============================================

function mostrar(id) {

    document
        .querySelectorAll(".seccion")
        .forEach(seccion => {

            seccion.classList.add("oculto");

        });


    document
        .getElementById(id)
        .classList.remove("oculto");


    actualizarTodo();

}


// ============================================
// GUARDAR DATOS
// ============================================

function guardarDatos() {

    localStorage.setItem(
        "docentes",
        JSON.stringify(docentes)
    );

    localStorage.setItem(
        "asignaturas",
        JSON.stringify(asignaturas)
    );

    localStorage.setItem(
        "asignaciones",
        JSON.stringify(asignaciones)
    );

    localStorage.setItem(
        "configuracionDocentes",
        JSON.stringify(configuracion)
    );

}


// ============================================
// AGREGAR DOCENTE
// ============================================

function agregarDocente() {

    const nombre =
        document.getElementById(
            "nombreDocente"
        ).value.trim();

    const tipo =
        document.getElementById(
            "tipoDocente"
        ).value;

    const horasRH =
        Number(
            document.getElementById(
                "horasRH"
            ).value
        );

    const limiteB =
        Number(
            document.getElementById(
                "limiteB"
            ).value
        ) || configuracion.maxB;

    const compartido =
        document.getElementById(
            "compartido"
        ).checked;


    if (!nombre) {

        alert(
            "Escribe el nombre del docente."
        );

        return;

    }


    if (horasRH <= 0) {

        alert(
            "Las horas autorizadas por RH deben ser mayores a 0."
        );

        return;

    }


    if (
        tipo === "A" &&
        horasRH > configuracion.maxA
    ) {

        alert(
            "Un docente A no puede superar " +
            configuracion.maxA +
            " horas."
        );

        return;

    }


    if (
        tipo === "B" &&
        horasRH > limiteB
    ) {

        alert(
            "Las horas del docente B superan su límite."
        );

        return;

    }


    docentes.push({

        id: Date.now(),

        nombre: nombre,

        tipo: tipo,

        horasRH: horasRH,

        limiteB:
            tipo === "B"
                ? limiteB
                : null,

        compartido: compartido,

        horasAsignadas: 0

    });


    guardarDatos();

    limpiarFormularioDocente();

    actualizarTodo();

}


// ============================================
// LIMPIAR DOCENTE
// ============================================

function limpiarFormularioDocente() {

    document.getElementById(
        "nombreDocente"
    ).value = "";

    document.getElementById(
        "horasRH"
    ).value = "";

    document.getElementById(
        "limiteB"
    ).value = "";

    document.getElementById(
        "compartido"
    ).checked = false;

}


// ============================================
// ELIMINAR DOCENTE
// ============================================

function eliminarDocente(id) {

    const tieneAsignaciones =
        asignaciones.some(
            a => a.docenteId === id
        );


    if (tieneAsignaciones) {

        alert(
            "No puedes eliminar un docente que ya tiene horas asignadas."
        );

        return;

    }


    docentes =
        docentes.filter(
            d => d.id !== id
        );


    guardarDatos();

    actualizarTodo();

}


// ============================================
// TABLA DOCENTES
// ============================================

function actualizarDocentes() {

    const tabla =
        document.getElementById(
            "tablaDocentes"
        );

    tabla.innerHTML = "";


    docentes.forEach(docente => {

        let estado = "";

        let clase = "";


        if (
            docente.horasAsignadas >=
            configuracion.minimo
        ) {

            estado = "Correcto";

            clase = "estado-ok";

        }

        else if (
            docente.horasAsignadas >=
            configuracion.flexible
        ) {

            estado =
                "Flexible: revisar";

            clase =
                "estado-alerta";

        }

        else {

            estado =
                "Por debajo del mínimo";

            clase =
                "estado-error";

        }


        tabla.innerHTML += `

        <tr>

            <td>
                ${docente.nombre}
            </td>

            <td>
                ${docente.tipo}
            </td>

            <td>
                ${docente.horasRH}
            </td>

            <td>
                ${docente.horasAsignadas}
            </td>

            <td>
                ${docente.compartido ? "Sí" : "No"}
            </td>

            <td class="${clase}">
                ${estado}
            </td>

            <td>

                <button
                    onclick="eliminarDocente(${docente.id})"
                >
                    Eliminar
                </button>

            </td>

        </tr>

        `;

    });

}


// ============================================
// ASIGNATURAS
// ============================================

function agregarAsignatura() {

    const nombre =
        document.getElementById(
            "nombreAsignatura"
        ).value.trim();

    const horas =
        Number(
            document.getElementById(
                "horasAsignatura"
            ).value
        );

    const tipo =
        document.getElementById(
            "tipoAsignatura"
        ).value;


    if (!nombre || horas <= 0) {

        alert(
            "Completa correctamente la asignatura."
        );

        return;

    }


    asignaturas.push({

        id: Date.now(),

        nombre: nombre,

        horas: horas,

        tipo: tipo

    });


    guardarDatos();

    document.getElementById(
        "nombreAsignatura"
    ).value = "";

    document.getElementById(
        "horasAsignatura"
    ).value = "";


    actualizarTodo();

}


// ============================================
// ELIMINAR ASIGNATURA
// ============================================

function eliminarAsignatura(id) {

    const usada =
        asignaciones.some(
            a => a.asignaturaId === id
        );


    if (usada) {

        alert(
            "No puedes eliminar una asignatura que ya tiene asignaciones."
        );

        return;

    }


    asignaturas =
        asignaturas.filter(
            a => a.id !== id
        );


    guardarDatos();

    actualizarTodo();

}


// ============================================
// TABLA ASIGNATURAS
// ============================================

function actualizarAsignaturas() {

    const tabla =
        document.getElementById(
            "tablaAsignaturas"
        );

    tabla.innerHTML = "";


    asignaturas.forEach(asignatura => {

        tabla.innerHTML += `

        <tr>

            <td>
                ${asignatura.nombre}
            </td>

            <td>
                ${asignatura.tipo}
            </td>

            <td>
                ${asignatura.horas}
            </td>

            <td>

                <button
                    onclick="eliminarAsignatura(${asignatura.id})"
                >
                    Eliminar
                </button>

            </td>

        </tr>

        `;

    });

}


// ============================================
// SELECT DOCENTES
// ============================================

function actualizarSelectDocentes() {

    const select =
        document.getElementById(
            "selectDocente"
        );


    select.innerHTML = `

        <option value="">
            Seleccionar docente
        </option>

    `;


    docentes.forEach(docente => {

        select.innerHTML += `

        <option value="${docente.id}">

            ${docente.nombre}
            (${docente.tipo})

        </option>

        `;

    });

}


// ============================================
// SELECT ASIGNATURAS
// ============================================

function actualizarSelectAsignaturas() {

    const select =
        document.getElementById(
            "selectAsignatura"
        );


    select.innerHTML = `

        <option value="">
            Seleccionar asignatura
        </option>

    `;


    asignaturas.forEach(asignatura => {

        select.innerHTML += `

        <option value="${asignatura.id}">

            ${asignatura.nombre}
            (${asignatura.tipo})

        </option>

        `;

    });

}


// ============================================
// ASIGNAR HORAS
// ============================================

function asignarHoras() {

    const docenteId =
        Number(
            document.getElementById(
                "selectDocente"
            ).value
        );

    const asignaturaId =
        Number(
            document.getElementById(
                "selectAsignatura"
            ).value
        );

    const cuatrimestre =
        document.getElementById(
            "selectCuatrimestre"
        ).value;

    const horas =
        Number(
            document.getElementById(
                "horasAsignacion"
            ).value
        );


    const docente =
        docentes.find(
            d => d.id === docenteId
        );

    const asignatura =
        asignaturas.find(
            a => a.id === asignaturaId
        );


    if (!docente || !asignatura) {

        mostrarMensaje(
            "Selecciona docente y asignatura.",
            "error"
        );

        return;

    }


    if (horas <= 0) {

        mostrarMensaje(
            "Las horas deben ser mayores a cero.",
            "error"
        );

        return;

    }


    // ========================================
    // HORAS TOTALES DISPONIBLES
    // ========================================

    const totalAsignado =
        calcularHorasTotales();


    if (
        totalAsignado + horas >
        configuracion.horasTotales
    ) {

        mostrarMensaje(
            "No hay suficientes horas disponibles.",
            "error"
        );

        return;

    }


    // ========================================
    // HORAS AUTORIZADAS POR RH
    // ========================================

    if (
        docente.horasAsignadas + horas >
        docente.horasRH
    ) {

        mostrarMensaje(
            "No puedes superar las horas autorizadas por Recursos Humanos.",
            "error"
        );

        return;

    }


    // ========================================
    // MÁXIMO TIPO A
    // ========================================

    if (
        docente.tipo === "A" &&
        docente.horasAsignadas + horas >
        configuracion.maxA
    ) {

        mostrarMensaje(
            "El docente A no puede superar las " +
            configuracion.maxA +
            " horas.",
            "error"
        );

        return;

    }


    // ========================================
    // MÁXIMO TIPO B
    // ========================================

    if (
        docente.tipo === "B" &&
        docente.horasAsignadas + horas >
        docente.limiteB
    ) {

        mostrarMensaje(
            "El docente B supera su límite de horas.",
            "error"
        );

        return;

    }


    // ========================================
    // ASIGNACIÓN
    // ========================================

    docente.horasAsignadas += horas;


    asignaciones.push({

        id: Date.now(),

        docenteId: docente.id,

        docente: docente.nombre,

        asignaturaId: asignatura.id,

        asignatura: asignatura.nombre,

        tipo: asignatura.tipo,

        cuatrimestre: cuatrimestre,

        horas: horas

    });


    guardarDatos();

    document.getElementById(
        "horasAsignacion"
    ).value = "";


    mostrarMensaje(
        "Horas asignadas correctamente.",
        "correcto"
    );


    actualizarTodo();

}


// ============================================
// MENSAJE
// ============================================

function mostrarMensaje(texto, tipo) {

    const mensaje =
        document.getElementById(
            "mensaje"
        );


    mensaje.className =
        tipo === "error"
            ? "alerta"
            : "correcto";


    mensaje.textContent = texto;

}


// ============================================
// TABLA ASIGNACIONES
// ============================================

function actualizarAsignaciones() {

    const tabla =
        document.getElementById(
            "tablaAsignaciones"
        );


    tabla.innerHTML = "";


    asignaciones.forEach(asignacion => {

        tabla.innerHTML += `

        <tr>

            <td>
                ${asignacion.docente}
            </td>

            <td>
                ${asignacion.asignatura}
            </td>

            <td>
                ${asignacion.tipo}
            </td>

            <td>
                ${asignacion.cuatrimestre}
            </td>

            <td>
                ${asignacion.horas}
            </td>

            <td>

                <button
                    onclick="eliminarAsignacion(${asignacion.id})"
                >
                    Eliminar
                </button>

            </td>

        </tr>

        `;

    });

}


// ============================================
// ELIMINAR ASIGNACIÓN
// ============================================

function eliminarAsignacion(id) {

    const asignacion =
        asignaciones.find(
            a => a.id === id
        );


    if (!asignacion) return;


    const docente =
        docentes.find(
            d => d.id === asignacion.docenteId
        );


    if (docente) {

        docente.horasAsignadas -=
            asignacion.horas;

    }


    asignaciones =
        asignaciones.filter(
            a => a.id !== id
        );


    guardarDatos();

    actualizarTodo();

}


// ============================================
// CALCULAR HORAS
// ============================================

function calcularHorasTotales() {

    return asignaciones.reduce(

        (total, asignacion) =>

            total + asignacion.horas,

        0

    );

}


// ============================================
// RESUMEN
// ============================================

function actualizarResumen() {

    const asignadas =
        calcularHorasTotales();

    const restantes =
        configuracion.horasTotales -
        asignadas;


    document.getElementById(
        "totalHoras"
    ).textContent =
        configuracion.horasTotales;


    document.getElementById(
        "horasAsignadas"
    ).textContent =
        asignadas;


    document.getElementById(
        "horasRestantes"
    ).textContent =
        restantes;


    document.getElementById(
        "totalDocentes"
    ).textContent =
        docentes.length;

}


// ============================================
// ALERTAS
// ============================================

function actualizarAlertas() {

    const contenedor =
        document.getElementById(
            "listaAlertas"
        );


    contenedor.innerHTML = "";

    let cantidad = 0;


    docentes.forEach(docente => {

        if (
            docente.horasAsignadas <
            configuracion.flexible
        ) {

            const faltan =
                configuracion.minimo -
                docente.horasAsignadas;


            contenedor.innerHTML += `

            <div class="alerta">

                <strong>
                    ${docente.nombre}
                </strong>

                tiene solamente
                ${docente.horasAsignadas}
                horas.

                Debe revisarse porque está
                por debajo del mínimo flexible.

            </div>

            `;


            cantidad++;

        }

        else if (
            docente.horasAsignadas <
            configuracion.minimo
        ) {

            contenedor.innerHTML += `

            <div class="advertencia">

                <strong>
                    ${docente.nombre}
                </strong>

                tiene
                ${docente.horasAsignadas}
                horas.

                Está por debajo del mínimo
                de ${configuracion.minimo},
                pero entra dentro del margen flexible.

            </div>

            `;


            cantidad++;

        }

    });


    document.getElementById(
        "totalAlertas"
    ).textContent =
        cantidad;


    if (cantidad === 0) {

        contenedor.innerHTML = `

        <div class="correcto">

            No existen alertas de horas.

        </div>

        `;

    }

}


// ============================================
// CUATRIMESTRE
// ============================================

function mostrarCuatrimestre() {

    const cuatrimestre =
        document.getElementById(
            "filtroCuatrimestre"
        ).value;


    const lista =
        asignaciones.filter(
            a =>
                a.cuatrimestre ===
                cuatrimestre
        );


    let total = 0;


    lista.forEach(
        a => total += a.horas
    );


    const contenedor =
        document.getElementById(
            "resumenCuatrimestre"
        );


    contenedor.innerHTML = `

        <div class="resumen">

            <h3>
                ${cuatrimestre}° cuatrimestre
            </h3>

            <p>
                Horas asignadas:
                <strong>${total}</strong>
            </p>

        </div>

    `;


    if (lista.length === 0) {

        contenedor.innerHTML += `

        <div class="advertencia">

            Todavía no existen asignaciones
            para este cuatrimestre.

        </div>

        `;

    }

}


// ============================================
// CONFIGURACIÓN
// ============================================

function cargarConfiguracion() {

    document.getElementById(
   