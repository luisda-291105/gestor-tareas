// js/task/tasksController.js

import LocalStorage from "../storage/localStorage.js";

export default class TasksController {
    constructor() {
        this.storage = new LocalStorage("tasks");
    }

    // crear tarea
    saveTasks(taskText) {

        const newTask = {
            text: taskText,
            completed: false
        };

        return this.storage.saveLocalStorage(newTask);
    }

    // obtener tareas
    searchTasks() {
        return this.storage.readLocalStorage();
    }

    // actualizar tarea
    updateTasks(id, data) {
        return this.storage.updateLocalStorage(id, data);
    }

    // eliminar tarea
    deleteTasks(id) {
        return this.storage.deleteLocalStorage(id);
    }

}