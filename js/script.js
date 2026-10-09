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

// Crea un botón pequeño con un icono de Bootstrap Icons.
function crearBotonIcono(clases, icono, etiqueta) {
    const boton = document.createElement('button');
    const simbolo = document.createElement('i');

    boton.type = 'button';
    boton.className = 'btn btn-sm ' + clases;
    boton.setAttribute('aria-label', etiqueta);

    simbolo.className = 'bi ' + icono;
    boton.appendChild(simbolo);

    return boton;
}

// Muestra los productos guardados y calcula el total.
function mostrarCarrito() {
    const lista = document.getElementById('lista-carrito');
    const totalCompra = document.getElementById('total-compra');
    const mensajeVacio = document.getElementById('mensaje-vacio');

    if (!lista || !totalCompra || !mensajeVacio) {
        return;
    }

    const carrito = obtenerCarrito();
    let total = 0;

    lista.textContent = '';

    if (carrito.length === 0) {
        mensajeVacio.classList.remove('d-none');
        totalCompra.textContent = '0.00';
        return;
    }

    mensajeVacio.classList.add('d-none');

    carrito.forEach(function (producto) {
        const subtotal = producto.precio * producto.cantidad;

        const columna = document.createElement('div');
        columna.className = 'col-12 col-md-6 col-lg-4 mb-3';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'card tarjeta-carrito h-100';

        const cuerpo = document.createElement('div');
        cuerpo.className = 'card-body';

        // Fila superior: nombre del producto y botón de basura.
        const encabezado = document.createElement('div');
        encabezado.className = 'd-flex justify-content-between align-items-start gap-2';

        const nombre = document.createElement('h5');
        nombre.className = 'card-title nombre-carrito';
        nombre.textContent = producto.nombre;

        const botonQuitar = crearBotonIcono(
            'btn-outline-danger btn-quitar',
            'bi-trash',
            'Quitar ' + producto.nombre
        );

        botonQuitar.addEventListener('click', function () {
            eliminarDelCarrito(producto.id);
            mostrarCarrito();
            mostrarAlerta('Producto eliminado del carrito', 'exito');
        });

        encabezado.appendChild(nombre);
        encabezado.appendChild(botonQuitar);

        const precio = document.createElement('p');
        precio.className = 'card-text precio-carrito';
        precio.textContent = '$' + producto.precio.toFixed(2) + ' c/u';

        // Controles de cantidad: menos, número y más.
        const controles = document.createElement('div');
        controles.className = 'd-flex align-items-center gap-2 mb-2';

        const botonMenos = crearBotonIcono('btn-light', 'bi-dash', 'Disminuir cantidad de ' + producto.nombre);
        const cantidad = document.createElement('span');
        const botonMas = crearBotonIcono('btn-light', 'bi-plus', 'Aumentar cantidad de ' + producto.nombre);

        cantidad.className = 'fw-semibold px-1';
        cantidad.textContent = producto.cantidad;
        botonMenos.disabled = producto.cantidad <= 1;

        botonMenos.addEventListener('click', function () {
            cambiarCantidad(producto.id, -1);
            mostrarCarrito();
        });

        botonMas.addEventListener('click', function () {
            cambiarCantidad(producto.id, 1);
            mostrarCarrito();
        });

        controles.appendChild(botonMenos);
        controles.appendChild(cantidad);
        controles.appendChild(botonMas);

        const textoSubtotal = document.createElement('p');
        textoSubtotal.className = 'card-text fw-semibold mb-0';
        textoSubtotal.textContent = 'Subtotal: $' + subtotal.toFixed(2);

        cuerpo.appendChild(encabezado);
        cuerpo.appendChild(precio);
        cuerpo.appendChild(controles);
        cuerpo.appendChild(textoSubtotal);
        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);
        lista.appendChild(columna);

        total += subtotal;
    });

    totalCompra.textContent = total.toFixed(2);
}

// Muestra la ventana con el resumen de la compra y después vacía el carrito.
function finalizarCompra() {
    const carrito = obtenerCarrito();

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
        const subtotal = producto.precio * producto.cantidad;

        const elemento = document.createElement('li');
        elemento.className = 'list-group-item d-flex justify-content-between';

        const nombre = document.createElement('span');
        nombre.textContent = producto.nombre + ' (x' + producto.cantidad + ')';

        const precio = document.createElement('span');
        precio.textContent = '$' + subtotal.toFixed(2);

        elemento.appendChild(nombre);
        elemento.appendChild(precio);
        lista.appendChild(elemento);

        total += subtotal;
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