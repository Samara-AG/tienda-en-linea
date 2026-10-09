// Lee los datos guardados; si la clave no existe, devuelve un arreglo vacío.
function obtener(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

// Convierte los datos a texto JSON y los guarda en localStorage.
function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

// Lee el carrito con la forma {id, nombre, precio, cantidad}.
// Junta los productos repetidos sumando su cantidad y arregla los carritos
// guardados antes de que existiera la cantidad (les asigna 1).
function obtenerCarrito() {
    const guardado = obtener('carrito');
    const carrito = [];

    guardado.forEach(function (producto) {
        const id = Number(producto.id);
        const cantidad = Number(producto.cantidad) || 1;

        const existente = carrito.find(function (item) {
            return item.id === id;
        });

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            carrito.push({
                id: id,
                nombre: producto.nombre,
                precio: Number(producto.precio),
                cantidad: cantidad
            });
        }
    });

    return carrito;
}

// Agrega el producto (o suma 1 a su cantidad si ya estaba) y guarda el carrito.
function agregarAlCarrito(producto) {
    const carrito = obtenerCarrito();
    const id = Number(producto.id);

    const existente = carrito.find(function (item) {
        return item.id === id;
    });

    if (existente) {
        existente.cantidad += 1;
    } else {
        // El precio debe ser un número para poder sumar correctamente.
        carrito.push({
            id: id,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            cantidad: 1
        });
    }

    guardar('carrito', carrito);

    mostrarAlerta('Producto añadido al carrito', 'exito');
}

// Sube o baja la cantidad de un producto (cambio vale 1 o -1).
// La cantidad nunca baja de 1: para quitar el producto se usa eliminarDelCarrito.
function cambiarCantidad(id, cambio) {
    const carrito = obtenerCarrito();

    const producto = carrito.find(function (item) {
        return item.id === Number(id);
    });

    if (!producto) {
        return;
    }

    producto.cantidad = Math.min(99, Math.max(1, producto.cantidad + cambio));
    guardar('carrito', carrito);
}

// Quita del carrito el producto con ese id (todas sus unidades).
function eliminarDelCarrito(id) {
    const carrito = obtenerCarrito().filter(function (item) {
        return item.id !== Number(id);
    });

    guardar('carrito', carrito);
}

// Genera un respaldo del carrito en un archivo de texto.
function exportarCarritoTxt() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        mostrarAlerta(
            'El carrito está vacío. Agrega productos antes de exportar.',
            'error'
        );
        return;
    }

    let total = 0;
    let contenido = 'Resumen de compra - Tienda en Línea\n';

    contenido += 'Generado: ' + new Date().toLocaleString('es-MX') + '\n';
    contenido += '='.repeat(40) + '\n\n';

    carrito.forEach(function (producto) {
        const subtotal = producto.precio * producto.cantidad;

        contenido += 'Producto: ' + producto.nombre;
        contenido += ' (x' + producto.cantidad + ')';
        contenido += ' - $' + subtotal.toLocaleString('es-MX') + '\n';

        total += subtotal;
    });

    // es-MX agrega la coma de miles: 1149 se muestra como 1,149.
    contenido += '-'.repeat(40) + '\n';
    contenido += 'TOTAL: $' + total.toLocaleString('es-MX', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }) + '\n';

    // El Blob convierte el texto en un archivo descargable.
    const archivo = new Blob([contenido], {
        type: 'text/plain;charset=utf-8'
    });

    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');

    enlace.href = url;
    enlace.download = 'carrito.txt';

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    // Libera la dirección temporal después de iniciar la descarga.
    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
}

// Conecta los botones cuando el HTML termina de cargar.
document.addEventListener('DOMContentLoaded', function () {
    const botonesAgregar = document.querySelectorAll('.btn-agregar');

    // En la página del carrito no hay estos botones: no se ejecuta el recorrido.
    botonesAgregar.forEach(function (boton) {
        boton.addEventListener('click', function () {
            const producto = {
                id: Number(boton.dataset.id),
                nombre: boton.dataset.nombre,
                precio: Number(boton.dataset.precio)
            };

            agregarAlCarrito(producto);
        });
    });

    const botonExportar = document.getElementById('btn-exportar-txt');

    // Este botón solamente existe en carrito_detalles.html.
    if (botonExportar) {
        botonExportar.addEventListener('click', exportarCarritoTxt);
    }
});