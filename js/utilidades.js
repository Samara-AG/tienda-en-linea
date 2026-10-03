// Lee los datos guardados; si la clave no existe, devuelve un arreglo vacío.
function obtener(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

// Convierte los datos a texto JSON y los guarda en localStorage.
function guardar(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}
