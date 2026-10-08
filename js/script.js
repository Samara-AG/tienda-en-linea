// Muestra una alerta y la elimina automáticamente.
function mostrarAlerta(mensaje, tipo) {
    const contenedor = document.getElementById('contenedor-alertas');

    if (!contenedor) {
        return;
    }

    const alerta = document.createElement('div');

    alerta.classList.add('alerta', 'alert');

    if (tipo === 'error') {
        alerta.classList.add('alerta-error', 'alert-danger');
        alerta.setAttribute('role', 'alert');
    } else {
        alerta.classList.add('alerta-exito', 'alert-success');
        alerta.setAttribute('role', 'status');
    }

    alerta.textContent = mensaje;
    contenedor.appendChild(alerta);

    setTimeout(function () {
        alerta.classList.add('alerta-salida');

        setTimeout(function () {
            alerta.remove();
        }, 400);
    }, 3000);
}

// Comprueba los campos y guarda el contacto.
function validarContacto(evento) {
    evento.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    if (nombre === '' || correo === '' || mensaje === '') {
        mostrarAlerta('Completa todos los campos del formulario.', 'error');
        return;
    }

    const campoCorreo = document.getElementById('correo');

    if (!campoCorreo.checkValidity()) {
        mostrarAlerta('Ingresa un correo electrónico válido.', 'error');
        return;
    }

    const contacto = {
        nombre: nombre,
        correo: correo,
        mensaje: mensaje
    };

    const contactos = obtener('contactos');

    contactos.push(contacto);
    guardar('contactos', contactos);

    mostrarAlerta('Formulario enviado correctamente.', 'exito');
    evento.target.reset();
}

// Muestra los productos guardados y calcula el total.
function mostrarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const totalCompra = document.getElementById('total-compra');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    if (!lista || !totalCompra || !mensajeVacio) {
        return;
    }

    const carrito = obtener('carrito');
    let total = 0;

    lista.textContent = '';

    if (carrito.length === 0) {
        mensajeVacio.classList.remove('d-none');
        totalCompra.textContent = '0.00';
        return;
    }

    mensajeVacio.classList.add('d-none');

    // El índice indica la posición del producto en la lista guardada.
    carrito.forEach(function (producto, indice) {
        const columna = document.createElement('div');
        columna.className = 'col-12 col-md-6 col-lg-4 mb-3';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card tarjeta-carrito h-100';

        const cuerpo = document.createElement('div');
        cuerpo.className = 'card-body';

        const nombre = document.createElement('h5');
        nombre.className = 'card-title nombre-carrito';
        nombre.textContent = producto.nombre;

        const precio = document.createElement('p');
        precio.className = 'card-text precio-carrito';
        precio.textContent = '$' + Number(producto.precio).toFixed(2);

        // Botón para quitar solo este producto (se usa la posición, no el id,
        // porque un mismo producto puede estar repetido en el carrito).
        const botonQuitar = document.createElement('button');
        botonQuitar.type = 'button';
        botonQuitar.className = 'btn btn-outline-primary btn-sm btn-quitar mt-2';
        botonQuitar.textContent = 'Quitar';
        botonQuitar.setAttribute('aria-label', 'Quitar ' + producto.nombre);

        botonQuitar.addEventListener('click', function () {
            eliminarDelCarrito(indice);
            mostrarCarrito();
            mostrarAlerta('Producto eliminado del carrito', 'exito');
        });

        cuerpo.appendChild(nombre);
        cuerpo.appendChild(precio);
        cuerpo.appendChild(botonQuitar);
        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);
        lista.appendChild(columna);

        total += Number(producto.precio);
    });

    totalCompra.textContent = total.toFixed(2);
}

// Muestra la ventana con el resumen de la compra y después vacía el carrito.
function finalizarCompra() {
    const carrito = obtener('carrito');

    if (carrito.length === 0) {
        mostrarAlerta('Tu carrito está vacío. Agrega productos antes de finalizar.', 'error');
        return;
    }

    const lista = document.getElementById('lista-compra');
    const totalModal = document.getElementById('total-compra-modal');
    const ventana = document.getElementById('modal-compra');

    if (!lista || !totalModal || !ventana) {
        return;
    }

    let total = 0;

    lista.textContent = '';

    carrito.forEach(function (producto) {
        const elemento = document.createElement('li');
        elemento.className = 'list-group-item d-flex justify-content-between';

        const nombre = document.createElement('span');
        nombre.textContent = producto.nombre;

        const precio = document.createElement('span');
        precio.textContent = '$' + Number(producto.precio).toFixed(2);

        elemento.appendChild(nombre);
        elemento.appendChild(precio);
        lista.appendChild(elemento);

        total += Number(producto.precio);
    });

    totalModal.textContent = total.toFixed(2);

    bootstrap.Modal.getOrCreateInstance(ventana).show();

    // La ventana ya tiene el resumen: ahora sí se vacía el carrito.
    guardar('carrito', []);
    mostrarCarrito();
}

// Activa solamente las funciones correspondientes a cada página.
document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formulario-contacto');

    if (formulario) {
        formulario.addEventListener('submit', validarContacto);
    }

    const botonFinalizar = document.getElementById('btn-finalizar');

    // Este botón solamente existe en carrito_detalles.html.
    if (botonFinalizar) {
        botonFinalizar.addEventListener('click', finalizarCompra);
    }

    mostrarCarrito();
});