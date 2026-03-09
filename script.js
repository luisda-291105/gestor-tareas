import TasksController from "./js/task/crudTask.js";

const tasksController = new TasksController();

// elementos html
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

// cargar tareas al iniciar
document.addEventListener("DOMContentLoaded", renderTasks);


// crear tarea
addBtn.addEventListener("click", () => {

    const text = taskInput.value.trim();

    if (!text) return;

    tasksController.saveTasks(text);

    taskInput.value = "";

    renderTasks();
});


// renderizar tareas
function renderTasks() {

    const tasks = tasksController.searchTasks();

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const div = document.createElement("div");

        div.className = "todo-item";

        div.innerHTML = `
        <div class="todo-left">

            <input type="checkbox" ${task.completed ? "checked" : ""} />

            <span>${task.text}</span>

        </div>

        <div class="todo-actions">

            <button data-edit="${task.id}">edit</button>

            <button data-delete="${task.id}">delete</button>

        </div>
        `;

        taskList.appendChild(div);

    });

}


// eliminar tarea
taskList.addEventListener("click", (e) => {

    const id = e.target.dataset.delete;

    if (id) {

        tasksController.deleteTasks(id);

        renderTasks();

    }

});


// completar tarea
taskList.addEventListener("change", (e) => {

    if (e.target.type === "checkbox") {

        const id = e.target.closest(".todo-item")
            .querySelector("[data-delete]").dataset.delete;

        tasksController.updateTasks(id, {
            completed: e.target.checked
        });

    }

});