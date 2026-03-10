// js/userController.js
/**
 * ARCHIVO: userController.js
 * DESCRIPCIÓN: Controlador principal para la gestión de usuarios
 * Maneja la inicialización de login, registro y tareas de usuario
 */

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    inicializarAplicacion();
});

/**
 * Inicializa la aplicación verificando el estado del usuario
 */
function inicializarAplicacion() {
    const usuarioActual = AlmacenamientoLocal.obtenerUsuarioActual();
    const rutaActual = window.location.pathname;
    
    // Si hay usuario logueado y estamos en index, redirigir a tasks
    if (usuarioActual && (rutaActual.endsWith('index.html') || rutaActual.endsWith('/'))) {
        window.location.href = 'tasks.html';
    }
    
    // Si no hay usuario y estamos en tasks, redirigir a login
    if (!usuarioActual && rutaActual.endsWith('tasks.html')) {
        window.location.href = 'login.html';
    }
}

/**
 * Inicializa el proceso de login
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 */
function iniciarLogin(email, password) {
    const usuarios = AlmacenamientoLocal.obtenerUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        AlmacenamientoLocal.guardarUsuarioActual(usuario);
        return {
            exito: true,
            mensaje: 'Login exitoso',
            usuario: usuario
        };
    }
    
    return {
        exito: false,
        mensaje: 'Credenciales inválidas'
    };
}

/**
 * Inicializa el proceso de registro
 * @param {Object} datosUsuario - Datos del nuevo usuario
 */
function iniciarRegistro(datosUsuario) {
    const usuarios = AlmacenamientoLocal.obtenerUsuarios();
    
    // Verificar si el email ya está registrado
    const existe = usuarios.some(u => u.email === datosUsuario.email);
    
    if (existe) {
        return {
            exito: false,
            mensaje: 'El email ya está registrado'
        };
    }
    
    // Crear nuevo usuario con fecha de registro
    const nuevoUsuario = {
        ...datosUsuario,
        fechaRegistro: new Date().toISOString()
    };
    
    AlmacenamientoLocal.guardarUsuario(nuevoUsuario);
    
    return {
        exito: true,
        mensaje: 'Registro exitoso',
        usuario: nuevoUsuario
    };
}

/**
 * Inicializa la página de tareas del usuario
 * @param {Object} usuario - Usuario actual
 */
function inicializarPaginaTareas(usuario) {
    if (!usuario) {
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar tareas del usuario
    const tareas = AlmacenamientoLocal.obtenerTareasUsuario(usuario.email);
    
    return {
        usuario: usuario,
        tareas: tareas
    };
}

/**
 * Obtiene todos los usuarios registrados
 */
function obtenerTodosLosUsuarios() {
    return AlmacenamientoLocal.obtenerUsuarios();
}

/**
 * Verifica si hay un usuario logueado
 */
function hayUsuarioLogueado() {
    return AlmacenamientoLocal.obtenerUsuarioActual() !== null;
}

/**
 * Obtiene el usuario actual
 */
function obtenerUsuarioActual() {
    return AlmacenamientoLocal.obtenerUsuarioActual();
}

/**
 * Actualiza los datos del usuario actual
 * @param {Object} nuevosDatos - Nuevos datos del usuario
 */
function actualizarUsuarioActual(nuevosDatos) {
    const usuarioActual = AlmacenamientoLocal.obtenerUsuarioActual();
    
    if (usuarioActual) {
        const usuarioActualizado = { ...usuarioActual, ...nuevosDatos };
        AlmacenamientoLocal.guardarUsuarioActual(usuarioActualizado);
        
        // También actualizar en la lista de usuarios
        const usuarios = AlmacenamientoLocal.obtenerUsuarios();
        const index = usuarios.findIndex(u => u.email === usuarioActual.email);
        
        if (index !== -1) {
            usuarios[index] = { ...usuarios[index], ...nuevosDatos };
            AlmacenamientoLocal.guardar('usuarios', usuarios);
        }
        
        return true;
    }
    
    return false;
}

// Exportar funciones para uso global
window.iniciarLogin = iniciarLogin;
window.iniciarRegistro = iniciarRegistro;
window.inicializarPaginaTareas = inicializarPaginaTareas;
window.obtenerTodosLosUsuarios = obtenerTodosLosUsuarios;
window.hayUsuarioLogueado = hayUsuarioLogueado;
window.obtenerUsuarioActual = obtenerUsuarioActual;
window.actualizarUsuarioActual = actualizarUsuarioActual;