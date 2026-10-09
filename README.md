# Tecnoteca · Tienda en línea

Tienda en línea de tecnología y accesorios hecha con HTML5, Bootstrap 5, CSS y JavaScript, sin librerías adicionales. Es el proyecto de la **Práctica 5 (Caso práctico 1)** de la asignatura Desarrollo de Aplicaciones Web.

- **Universidad:** Benemérita Universidad Autónoma de Puebla (BUAP)
- **Facultad:** Ciencias de la Computación
- **Asignatura:** Desarrollo de Aplicaciones Web
- **Profesor:** Dr. Luis Yael Méndez Sánchez
- **Periodo:** Otoño 2026

## Descripción

El sitio tiene dos páginas:

- **`index.html`:** portada, catálogo de 11 productos y formulario de contacto.
- **`carrito_detalles.html`:** el carrito de compras con su resumen y total.

## Funcionalidades

- **Catálogo** con 11 productos, cada uno con imagen, nombre, precio y botón para añadirlo al carrito.
- **Carrito persistente:** se guarda en `localStorage`, así que se conserva al recargar la página o cerrar el navegador.
- **Cantidades:** si un producto ya está en el carrito, se suma su cantidad (hasta 99). En el carrito se pueden cambiar con los botones − y +.
- **Quitar productos** con el botón de basura.
- **Resumen del carrito:** imagen de cada producto, subtotal, total y un indicador de cuántos productos distintos hay.
- **Finalizar compra:** muestra una ventana con los productos, las cantidades y el total, y después vacía el carrito. No hay pago real.
- **Exportación a `carrito.txt`:** primero muestra una vista previa y desde ahí se descarga el archivo.
- **Formulario de contacto** con validación de campos vacíos y de correo. Guarda los mensajes en `localStorage`.
- **Alertas dinámicas** de éxito y error que desaparecen solas.
- **Diseño responsivo** para escritorio, tableta y móvil.

## Tecnologías

- HTML5 semántico
- [Bootstrap 5.3](https://getbootstrap.com/) y [Bootstrap Icons](https://icons.getbootstrap.com/) (por CDN)
- CSS3 propio (variables, animaciones, `media queries`)
- JavaScript (sin frameworks)
- `localStorage`, `JSON`, `Blob` y `URL.createObjectURL`
- Tipografía Inter (Google Fonts)
- Git y GitHub (una rama por persona y *Pull Requests*)

## Estructura del proyecto

```
tienda-en-linea/
├── index.html
├── carrito_detalles.html
├── README.md
├── css/
│   └── style.css
├── js/
│   ├── utilidades.js
│   └── script.js
└── img/
    └── producto1 ... producto11 (imágenes de los productos)
```

- **`css/style.css`:** estilos propios sobre Bootstrap: paleta, tipografía, rejilla responsiva, tarjetas y animaciones de las alertas.
- **`js/utilidades.js`:** funciones del carrito y de los datos: `obtener`, `guardar`, `obtenerCarrito`, `agregarAlCarrito`, `cambiarCantidad`, `eliminarDelCarrito` y la exportación a TXT.
- **`js/script.js`:** alertas, validación del formulario, vista del carrito y finalizar compra.

## Cómo ejecutarlo

No requiere instalación.

1. Descarga el proyecto (**Code → Download ZIP**) o clónalo:
   ```
   git clone https://github.com/Samara-AG/tienda-en-linea.git
   ```
2. Abre la carpeta y haz doble clic en `index.html`, o ábrela en **Visual Studio Code** y usa la extensión **Live Server** (*Go Live*).
3. Se necesita conexión a internet para cargar Bootstrap, los iconos y la tipografía, que vienen de CDN.

> El carrito se guarda en `localStorage`, que es distinto para cada navegador y cada dirección. Un carrito creado con Live Server no aparece si se abre el archivo directamente desde la carpeta.

## Datos que se guardan

| Clave | Contenido |
| --- | --- |
| `carrito` | Arreglo de productos con `id`, `nombre`, `precio`, `cantidad` e `imagen`. |
| `contactos` | Arreglo de mensajes con `nombre`, `correo` y `mensaje`. |

## Integrantes y tareas

| Integrante | Tareas |
| --- | --- |
| Samara Arias Gil | `index.html`, ids y clases compartidos, repositorio, integración de las ramas, ampliación del carrito y entrega. |
| Carlos Alexander Castillo Gómez | `style.css`, imágenes de los productos, pruebas de responsividad, README y coordinación del reporte. |
| Jesús Daniel Espinosa Solano | `carrito_detalles.html`, pruebas del carrito y capturas de pantalla. |
| Sandro Farid Díaz Rodríguez | `utilidades.js`: carrito, persistencia en `localStorage` y exportación a TXT. |
| Mía Canales Corona | `script.js`: alertas, validación del formulario y vista del carrito. |

## Forma de trabajo

- Antes de empezar se acordaron los ids, las clases, las claves de `localStorage` y los nombres de las funciones, para trabajar en paralelo sin chocar.
- Cada integrante trabajó en su propia rama y llevó sus cambios a `main` con un *Pull Request*.
- La rama `main` está protegida: los cambios entran solo mediante *Pull Request*.

## Posibles mejoras

- Conectar el sitio a una base de datos y a un servidor, para que el carrito no dependa de un solo navegador.
- Cuentas de usuario y pago real.
- Buscador y filtros por categoría.