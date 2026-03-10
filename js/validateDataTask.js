// js/validateDataTask.js
/**
 * ARCHIVO: validateDataTask.js
 * DESCRIPCIÓN: Valida los datos de las tareas antes de ser guardadas
 * Asegura que todos los campos requeridos estén presentes y tengan el formato correcto
 */

/**
 * Valida los datos de una tarea
 * @param {Object} datosTarea - Objeto con los datos de la tarea
 * @returns {Object} - Resultado de la validación con mensaje y estado
 */
function validarDatosTarea(datosTarea) {
    const errores = [];
    
    // Validar título
    if (!datosTarea.titulo || datosTarea.titulo.trim() === '') {
        errores.push('El título de la tarea es obligatorio');
    } else if (datosTarea.titulo.length > 100) {
        errores.push('El título no puede tener más de 100 caracteres');
    }
    
    // Validar descripción (opcional pero con límite)
    if (datosTarea.descripcion && datosTarea.descripcion.length > 500) {
        errores.push('La descripción no puede tener más de 500 caracteres');
    }
    
    // Validar categoría
    if (!datosTarea.categoria) {
        errores.push('Debes seleccionar una categoría');
    }
    
    // Validar fecha
    if (!datosTarea.fecha) {
        errores.push('La fecha es obligatoria');
    } else {
        const fechaValida = validarFecha(datosTarea.fecha);
        if (!fechaValida.valida) {
            errores.push(fechaValida.mensaje);
        }
    }
    
    // Si hay errores, retornar resultado fallido
    if (errores.length > 0) {
        return {
            valida: false,
            errores: errores,
            mensaje: errores.join('. ')
        };
    }
    
    // Todo válido, retornar datos limpios
    return {
        valida: true,
        datos: limpiarDatosTarea(datosTarea),
        mensaje: 'Tarea válida'
    };
}

/**
 * Valida que la fecha sea correcta y no sea demasiado antigua
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {Object} - Resultado de la validación
 */
function validarFecha(fecha) {
    const fechaObj = new Date(fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Verificar que la fecha sea válida
    if (isNaN(fechaObj.getTime())) {
        return {
            valida: false,
            mensaje: 'La fecha no es válida'
        };
    }
    
    // Opcional: no permitir fechas muy antiguas (más de 1 año)
    const unAnioAtras = new Date();
    unAnioAtras.setFullYear(unAnioAtras.getFullYear() - 1);
    
    if (fechaObj < unAnioAtras) {
        return {
            valida: false,
            mensaje: 'No puedes crear tareas con más de un año de antigüedad'
        };
    }
    
    return {
        valida: true,
        mensaje: 'Fecha válida'
    };
}

/**
 * Limpia y sanitiza los datos de la tarea
 * @param {Object} datosTarea - Datos sin limpiar
 * @returns {Object} - Datos limpios y sanitizados
 */
function limpiarDatosTarea(datosTarea) {
    return {
        id: datosTarea.id || generarIdUnico(),
        titulo: datosTarea.titulo ? datosTarea.titulo.trim() : '',
        descripcion: datosTarea.descripcion ? datosTarea.descripcion.trim() : '',
        categoria: datosTarea.categoria || 'General',
        fecha: datosTarea.fecha,
        hora: datosTarea.hora || '',
        importante: datosTarea.importante || false,
        completada: datosTarea.completada || false,
        fechaCreacion: datosTarea.fechaCreacion || new Date().toISOString()
    };
}

/**
 * Genera un ID único para la tarea
 * @returns {string} - ID único
 */
function generarIdUnico() {
    return 'tarea_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Valida que una tarea pueda ser eliminada
 * @param {Object} tarea - Tarea a validar
 * @returns {boolean} - True si puede ser eliminada
 */
function validarEliminacionTarea(tarea) {
    // Por ahora, cualquier tarea puede ser eliminada
    // En el futuro se podrían agregar validaciones adicionales
    return tarea && tarea.id;
}

/**
 * Verifica si una tarea está vencida
 * @param {Object} tarea - Tarea a verificar
 * @returns {boolean} - True si está vencida
 */
function tareaVencida(tarea) {
    if (tarea.completada) return false;
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const fechaTarea = new Date(tarea.fecha);
    fechaTarea.setHours(0, 0, 0, 0);
    
    return fechaTarea < hoy;
}

/**
 * Obtiene el estado de una tarea para mostrar
 * @param {Object} tarea - Tarea a evaluar
 * @returns {string} - Estado de la tarea
 */
function obtenerEstadoTarea(tarea) {
    if (tarea.completada) return 'completada';
    if (tareaVencida(tarea)) return 'vencida';
    if (tarea.importante) return 'importante';
    return 'pendiente';
}