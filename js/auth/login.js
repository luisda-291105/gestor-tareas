// js/auth/login.js
/**
 * ARCHIVO: login.js
 * DESCRIPCIÓN: Maneja la autenticación de usuarios incluyendo login y registro
 * Valida credenciales y gestiona la sesión del usuario
 */

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar en qué página estamos
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        inicializarLogin();
    }

    if (registerForm) {
        inicializarRegistro();
    }
});

/**
 * Inicializa el formulario de login
 */
function inicializarLogin() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Validar campos vacíos
        if (!email || !password) {
            mostrarMensaje('Por favor completa todos los campos', 'danger');
            return;
        }
        
        // Intentar iniciar sesión
        const resultado = validarUsuario(email, password);
        
        if (resultado.exito) {
            mostrarMensaje('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
            
            // Guardar usuario actual
            AlmacenamientoLocal.guardarUsuarioActual(resultado.usuario);
            
            // Redirigir a la página de tareas después de 1 segundo
            setTimeout(() => {
                window.location.href = 'tasks.html';
            }, 1000);
        } else {
            mostrarMensaje(resultado.mensaje, 'danger');
        }
    });
}

/**
 * Inicializa el formulario de registro
 */
function inicializarRegistro() {
    const registerForm = document.getElementById('registerForm');
    
    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const nombre = document.getElementById('nombre').value.trim();
        const apellido = document.getElementById('apellido').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirmPassword').value.trim();
        
        // Validar campos vacíos
        if (!nombre || !apellido || !email || !password || !confirmPassword) {
            mostrarMensaje('Por favor completa todos los campos', 'danger');
            return;
        }
        
        // Validar que las contraseñas coincidan
        if (password !== confirmPassword) {
            mostrarMensaje('Las contraseñas no coinciden', 'danger');
            return;
        }
        
        // Validar longitud de contraseña
        if (password.length < 6) {
            mostrarMensaje('La contraseña debe tener al menos 6 caracteres', 'danger');
            return;
        }
        
        // Validar formato de email
        if (!validarEmail(email)) {
            mostrarMensaje('Por favor ingresa un email válido', 'danger');
            return;
        }
        
        // Verificar si el usuario ya existe
        const usuarios = AlmacenamientoLocal.obtenerUsuarios();
        const usuarioExistente = usuarios.find(u => u.email === email);
        
        if (usuarioExistente) {
            mostrarMensaje('Ya existe un usuario con ese email', 'danger');
            return;
        }
        
        // Crear nuevo usuario
        const nuevoUsuario = {
            nombre,
            apellido,
            email,
            password, // En una app real, esto debería estar hasheado
            fechaRegistro: new Date().toISOString()
        };
        
        // Guardar usuario
        AlmacenamientoLocal.guardarUsuario(nuevoUsuario);
        
        mostrarMensaje('¡Registro exitoso! Redirigiendo al login...', 'success');
        
        // Redirigir al login después de 1.5 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
    });
}

/**
 * Valida las credenciales del usuario
 * @param {string} email - Email del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Object} - Resultado de la validación
 */
function validarUsuario(email, password) {
    const usuarios = AlmacenamientoLocal.obtenerUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === password);
    
    if (usuario) {
        return {
            exito: true,
            mensaje: 'Login exitoso',
            usuario: usuario
        };
    } else {
        return {
            exito: false,
            mensaje: 'Email o contraseña incorrectos'
        };
    }
}

/**
 * Muestra un mensaje en la alerta del formulario
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de alerta (success, danger, warning, info)
 */
function mostrarMensaje(mensaje, tipo) {
    const alerta = document.getElementById('mensajeAlerta');
    alerta.className = `alert alert-${tipo}`;
    alerta.textContent = mensaje;
    alerta.classList.remove('d-none');
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        alerta.classList.add('d-none');
    }, 3000);
}

/**
 * Valida el formato de un email
 * @param {string} email - Email a validar
 * @returns {boolean} - True si el email es válido
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Obtiene todos los usuarios registrados
 * @returns {Array} - Array de usuarios
 */
function obtenerUsuarios() {
    return AlmacenamientoLocal.obtenerUsuarios();
}