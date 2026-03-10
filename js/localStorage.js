// js/localStorage.js
/**
 * ARCHIVO: localStorage.js
 * DESCRIPCIÓN: Clase para manejar todas las operaciones de localStorage
 * Proporciona métodos CRUD para interactuar con el almacenamiento local del navegador
 */

class AlmacenamientoLocal {
    /**
     * Guarda datos en localStorage
     * @param {string} clave - La clave bajo la cual guardar los datos
     * @param {any} datos - Los datos a guardar (se convierten a JSON)
     */
    static guardar(clave, datos) {
        try {
            const datosJSON = JSON.stringify(datos);
            localStorage.setItem(clave, datosJSON);
            return true;
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
            return false;
        }
    }

    /**
     * Lee datos de localStorage
     * @param {string} clave - La clave de los datos a leer
     * @returns {any} - Los datos parseados o null si no existen
     */
    static leer(clave) {
        try {
            const datos = localStorage.getItem(clave);
            return datos ? JSON.parse(datos) : null;
        } catch (error) {
            console.error('Error al leer de localStorage:', error);
            return null;
        }
    }

    /**
     * Actualiza datos existentes en localStorage
     * @param {string} clave - La clave de los datos a actualizar
     * @param {any} nuevosDatos - Los nuevos datos para actualizar
     */
    static actualizar(clave, nuevosDatos) {
        try {
            const datosExistentes = this.leer(clave);
            if (datosExistentes) {
                const datosActualizados = { ...datosExistentes, ...nuevosDatos };
                return this.guardar(clave, datosActualizados);
            }
            return false;
        } catch (error) {
            console.error('Error al actualizar en localStorage:', error);
            return false;
        }
    }

    /**
     * Elimina datos de localStorage
     * @param {string} clave - La clave de los datos a eliminar
     */
    static eliminar(clave) {
        try {
            localStorage.removeItem(clave);
            return true;
        } catch (error) {
            console.error('Error al eliminar de localStorage:', error);
            return false;
        }
    }

    /**
     * Verifica si existe una clave en localStorage
     * @param {string} clave - La clave a verificar
     */
    static existe(clave) {
        return localStorage.getItem(clave) !== null;
    }

    /**
     * Obtiene todos los usuarios registrados
     */
    static obtenerUsuarios() {
        const usuarios = this.leer('usuarios');
        return usuarios || [];
    }

    /**
     * Guarda un nuevo usuario
     * @param {Object} usuario - Datos del usuario a guardar
     */
    static guardarUsuario(usuario) {
        const usuarios = this.obtenerUsuarios();
        usuarios.push(usuario);
        return this.guardar('usuarios', usuarios);
    }

    /**
     * Obtiene las tareas de un usuario específico
     * @param {string} email - Email del usuario
     */
    static obtenerTareasUsuario(email) {
        const clave = `tareas_${email}`;
        const tareas = this.leer(clave);
        return tareas || [];
    }

    /**
     * Guarda las tareas de un usuario específico
     * @param {string} email - Email del usuario
     * @param {Array} tareas - Array de tareas a guardar
     */
    static guardarTareasUsuario(email, tareas) {
        const clave = `tareas_${email}`;
        return this.guardar(clave, tareas);
    }

    /**
     * Obtiene el usuario actualmente logueado
     */
    static obtenerUsuarioActual() {
        return this.leer('usuarioActual');
    }

    /**
     * Guarda el usuario actualmente logueado
     * @param {Object} usuario - Datos del usuario actual
     */
    static guardarUsuarioActual(usuario) {
        return this.guardar('usuarioActual', usuario);
    }

    /**
     * Cierra la sesión del usuario actual
     */
    static cerrarSesion() {
        this.eliminar('usuarioActual');
    }
}

// Exportar la clase para uso global
window.AlmacenamientoLocal = AlmacenamientoLocal;