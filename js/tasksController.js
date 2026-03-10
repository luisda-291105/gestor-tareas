// js/tasksController.js
/**
 * ARCHIVO: tasksController.js
 * DESCRIPCIÓN: Controlador principal para la gestión de tareas
 * Maneja el CRUD de tareas y la interacción con la interfaz de usuario
 */

// Variable global para almacenar el usuario actual
let usuarioActual = null;
let tareasActuales = [];
let categoriaSeleccionada = 'Todas';

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si estamos en la página de tareas
    if (document.getElementById('listaTareas')) {
        inicializarPaginaTareas();
    }
});

/**
 * Inicializa la página de tareas
 */
function inicializarPaginaTareas() {
    // Verificar si hay usuario logueado
    usuarioActual = AlmacenamientoLocal.obtenerUsuarioActual();
    
    if (!usuarioActual) {
        // Si no hay usuario, redirigir al login
        window.location.href = 'login.html';
        return;
    }
    
    // Mostrar nombre del usuario
    document.getElementById('nombreUsuario').textContent = usuarioActual.nombre;
    
    // Cargar tareas del usuario
    cargarTareasUsuario();
    
    // Mostrar fecha actual
    mostrarFechaActual();
    
    // Inicializar event listeners
    inicializarEventListeners();
    
    // Renderizar categorías y tareas
    renderizarCategorias();
    renderizarTareas();
}

/**
 * Inicializa los event listeners de la página
 */
function inicializarEventListeners() {
    // Cerrar sesión
    document.getElementById('cerrarSesion').addEventListener('click', function(event) {
        event.preventDefault();
        cerrarSesion();
    });
}

/**
 * Carga las tareas del usuario desde localStorage
 */
function cargarTareasUsuario() {
    tareasActuales = AlmacenamientoLocal.obtenerTareasUsuario(usuarioActual.email);
}

/**
 * Guarda las tareas del usuario en localStorage
 */
function guardarTareasUsuario() {
    AlmacenamientoLocal.guardarTareasUsuario(usuarioActual.email, tareasActuales);
}

/**
 * Muestra la fecha actual en el formato deseado
 */
function mostrarFechaActual() {
    const fecha = new Date();
    const opciones = { day: 'numeric', month: 'long', year: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    document.getElementById('fechaActual').textContent = fechaFormateada;
}

/**
 * Renderiza las categorías en la barra lateral
 */
function renderizarCategorias() {
    const contenedor = document.getElementById('listaCategorias');
    const categorias = obtenerCategoriasConConteo();
    
    let html = '';
    
    // Categoría "Todas"
    html += `
        <div class="category-item ${categoriaSeleccionada === 'Todas' ? 'active' : ''}" onclick="seleccionarCategoria('Todas')">
            <span><i class="fas fa-inbox me-2"></i>Todas las tareas</span>
            <span class="badge bg-secondary">${tareasActuales.length}</span>
        </div>
    `;
    
    // Categorías dinámicas
    categorias.forEach(cat => {
        if (cat.nombre !== 'Todas') {
            html += `
                <div class="category-item ${categoriaSeleccionada === cat.nombre ? 'active' : ''}" onclick="seleccionarCategoria('${cat.nombre}')">
                    <span><i class="fas fa-tag me-2"></i>${cat.nombre}</span>
                    <span class="badge bg-secondary">${cat.conteo}</span>
                </div>
            `;
        }
    });
    
    contenedor.innerHTML = html;
    
    // Actualizar total de categorías
    document.getElementById('totalCategorias').textContent = `${categorias.length} categorías`;
}

/**
 * Obtiene las categorías con el conteo de tareas
 */
function obtenerCategoriasConConteo() {
    const categoriasMap = new Map();
    
    tareasActuales.forEach(tarea => {
        const cat = tarea.categoria || 'General';
        categoriasMap.set(cat, (categoriasMap.get(cat) || 0) + 1);
    });
    
    const categorias = [];
    categoriasMap.forEach((conteo, nombre) => {
        categorias.push({ nombre, conteo });
    });
    
    return categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));
}

/**
 * Selecciona una categoría para filtrar
 * @param {string} categoria - Categoría seleccionada
 */
function seleccionarCategoria(categoria) {
    categoriaSeleccionada = categoria;
    renderizarCategorias();
    renderizarTareas();
}

/**
 * Renderiza las tareas según la categoría seleccionada
 */
function renderizarTareas() {
    const contenedor = document.getElementById('listaTareas');
    let tareasFiltradas = [];
    
    // Filtrar por categoría
    if (categoriaSeleccionada === 'Todas') {
        tareasFiltradas = [...tareasActuales];
    } else {
        tareasFiltradas = tareasActuales.filter(t => t.categoria === categoriaSeleccionada);
    }
    
    // Ordenar: primero importantes, luego pendientes, luego completadas
    tareasFiltradas.sort((a, b) => {
        if (a.importante && !b.importante) return -1;
        if (!a.importante && b.importante) return 1;
        if (!a.completada && b.completada) return -1;
        if (a.completada && !b.completada) return 1;
        return new Date(a.fecha) - new Date(b.fecha);
    });
    
    // Actualizar contador
    const completadas = tareasFiltradas.filter(t => t.completada).length;
    document.getElementById('contadorTareas').textContent = 
        `${completadas} de ${tareasFiltradas.length} items`;
    
    // Generar HTML
    let html = '';
    
    if (tareasFiltradas.length === 0) {
        html = `
            <div class="text-center py-5 text-muted">
                <i class="fas fa-clipboard-list fa-3x mb-3"></i>
                <p>No hay tareas en esta categoría</p>
                <button class="btn btn-primary btn-sm" onclick="mostrarModalNuevaTarea()">
                    <i class="fas fa-plus me-2"></i>Crear primera tarea
                </button>
            </div>
        `;
    } else {
        tareasFiltradas.forEach(tarea => {
            const estado = obtenerEstadoTarea(tarea);
            const fecha = new Date(tarea.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es-ES');
            
            let claseTarea = 'task-item list-group-item list-group-item-action';
            if (tarea.importante) claseTarea += ' importante';
            if (tarea.completada) claseTarea += ' completada';
            
            html += `
                <div class="${claseTarea}" data-id="${tarea.id}">
                    <div class="d-flex align-items-center">
                        <div class="form-check me-3">
                            <input class="form-check-input" type="checkbox" 
                                ${tarea.completada ? 'checked' : ''} 
                                onchange="marcarCompletada('${tarea.id}', this.checked)">
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="mb-1 ${tarea.completada ? 'text-decoration-line-through' : ''}">
                                    ${tarea.titulo}
                                </h6>
                                <small class="text-muted">${fechaFormateada} ${tarea.hora || ''}</small>
                            </div>
                            <p class="mb-1 text-muted small">${tarea.descripcion || ''}</p>
                            <div class="d-flex align-items-center">
                                <span class="badge bg-secondary me-2">${tarea.categoria || 'General'}</span>
                                ${tarea.importante ? '<span class="badge bg-danger me-2">Importante</span>' : ''}
                                ${estado === 'vencida' ? '<span class="badge bg-warning">Vencida</span>' : ''}
                            </div>
                        </div>
                        <div class="ms-3">
                            <button class="btn btn-sm btn-outline-primary me-1" onclick="editarTarea('${tarea.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="eliminarTarea('${tarea.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    contenedor.innerHTML = html;
}

/**
 * Muestra el modal para crear una nueva tarea
 */
function mostrarModalNuevaTarea() {
    // Limpiar formulario
    document.getElementById('formTarea').reset();
    document.getElementById('tituloTarea').value = '';
    document.getElementById('descripcionTarea').value = '';
    document.getElementById('fechaTarea').value = new Date().toISOString().split('T')[0];
    
    // Configurar modal para nueva tarea
    const modal = new bootstrap.Modal(document.getElementById('modalTarea'));
    modal.show();
}

/**
 * Guarda una tarea (nueva o editada)
 */
function guardarTarea() {
    const titulo = document.getElementById('tituloTarea').value;
    const descripcion = document.getElementById('descripcionTarea').value;
    const categoria = document.getElementById('categoriaTarea').value;
    const fecha = document.getElementById('fechaTarea').value;
    const hora = document.getElementById('horaTarea').value;
    const importante = document.getElementById('importanteTarea').checked;
    
    // Validar datos
    const datosTarea = {
        titulo,
        descripcion,
        categoria,
        fecha,
        hora,
        importante
    };
    
    const validacion = validarDatosTarea(datosTarea);
    
    if (!validacion.valida) {
        alert(validacion.mensaje);
        return;
    }
    
    // Agregar ID y fecha de creación
    datosTarea.id = generarIdUnico();
    datosTarea.completada = false;
    datosTarea.fechaCreacion = new Date().toISOString();
    
    // Guardar tarea
    tareasActuales.push(datosTarea);
    guardarTareasUsuario();
    
    // Actualizar interfaz
    renderizarCategorias();
    renderizarTareas();
    
    // Cerrar modal
    bootstrap.Modal.getInstance(document.getElementById('modalTarea')).hide();
}

/**
 * Marca una tarea como completada o pendiente
 * @param {string} id - ID de la tarea
 * @param {boolean} completada - Estado de completado
 */
function marcarCompletada(id, completada) {
    const tarea = tareasActuales.find(t => t.id === id);
    if (tarea) {
        tarea.completada = completada;
        guardarTareasUsuario();
        renderizarTareas();
    }
}

/**
 * Elimina una tarea
 * @param {string} id - ID de la tarea a eliminar
 */
function eliminarTarea(id) {
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        tareasActuales = tareasActuales.filter(t => t.id !== id);
        guardarTareasUsuario();
        renderizarCategorias();
        renderizarTareas();
    }
}

/**
 * Edita una tarea existente
 * @param {string} id - ID de la tarea a editar
 */
function editarTarea(id) {
    const tarea = tareasActuales.find(t => t.id === id);
    if (tarea) {
        // Llenar formulario con datos de la tarea
        document.getElementById('tituloTarea').value = tarea.titulo;
        document.getElementById('descripcionTarea').value = tarea.descripcion || '';
        document.getElementById('categoriaTarea').value = tarea.categoria || 'General';
        document.getElementById('fechaTarea').value = tarea.fecha;
        document.getElementById('horaTarea').value = tarea.hora || '';
        document.getElementById('importanteTarea').checked = tarea.importante || false;
        
        // Mostrar modal
        const modal = new bootstrap.Modal(document.getElementById('modalTarea'));
        modal.show();
        
        // Eliminar la tarea antigua (se creará una nueva al guardar)
        tareasActuales = tareasActuales.filter(t => t.id !== id);
    }
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesion() {
    AlmacenamientoLocal.cerrarSesion();
    window.location.href = 'index.html';
}