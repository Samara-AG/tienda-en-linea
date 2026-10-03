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

    carrito.forEach(function (producto) {
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

        cuerpo.appendChild(nombre);
        cuerpo.appendChild(precio);
        tarjeta.appendChild(cuerpo);
        columna.appendChild(tarjeta);
        lista.appendChild(columna);

        total += Number(producto.precio);
    });

    totalCompra.textContent = total.toFixed(2);
}

// Activa solamente las funciones correspondientes a cada página.
document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formulario-contacto');

    if (formulario) {
        formulario.addEventListener('submit', validarContacto);
    }

    mostrarCarrito();
});
