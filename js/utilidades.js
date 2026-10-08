// Lee los datos guardados; si la clave no existe, devuelve un arreglo vacío.
function obtener(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

// Convierte los datos a texto JSON y los guarda en localStorage.
function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

// Agrega el producto y guarda el carrito actualizado.
function agregarAlCarrito(producto) {
    const carrito = obtener('carrito');

    // El precio debe ser un número para poder sumar correctamente.
    const productoNuevo = {
        id: Number(producto.id),
        nombre: producto.nombre,
        precio: Number(producto.precio)
    };

    carrito.push(productoNuevo);
    guardar('carrito', carrito);

    mostrarAlerta('Producto añadido al carrito', 'exito');
}

// Quita del carrito el producto que está en esa posición de la lista.
function eliminarDelCarrito(indice) {
    const carrito = obtener('carrito');

    carrito.splice(indice, 1);
    guardar('carrito', carrito);
}

// Genera un respaldo del carrito en un archivo de texto.
function exportarCarritoTxt() {
    const carrito = obtener('carrito');

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
        const precio = Number(producto.precio);

        contenido += 'Producto: ' + producto.nombre;
        contenido += ' - $' + precio.toLocaleString('es-MX') + '\n';

        total += precio;
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