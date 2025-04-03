import {
    buildXmlFromObj,
    forwardToOverview, loadTasksByTodoId, loadTodoById,
    sendItemToDB,
    validateBegonnenStatus,
} from "./services.js";

document.addEventListener("DOMContentLoaded", async () => {
    await todoPageLoaded();
});

function initDomReferences() {
    return {
        body: document.getElementById("bodyTodoPage"),
        titleInput: document.getElementById("todoTitleInput"),
        descriptionTextarea: document.getElementById("todoDescriptionTextarea"),
        statusSelect: document.getElementById("statusPopupTodo"),
        addButton: document.getElementById("buttonAddTodo"),
        showTasksButton: document.getElementById("buttonShowTasks"),
        hideTasksButton: document.getElementById("buttonHideTasks"),
        tasksContainer: document.querySelector(".containerHiddenTasksContainedTasks"),
        tasksWrapper: document.querySelector(".containerHiddenTasks")
    };
}

/**
 *
 * @returns {Promise<void>}
 */
async function todoPageLoaded() {
    const {
        body,
        titleInput,
        descriptionTextarea,
        statusSelect,
        addButton,
        showTasksButton,
        hideTasksButton,
        tasksContainer,
        tasksWrapper
    } = initDomReferences();

    if (!body) return;


    console.log("Todo page loading...");

    const params = new URLSearchParams(window.location.search);
    const todoId = params.get("id");

    if (todoId) {
        const todo = await loadTodoById(todoId);
        const tasks = await loadTasksByTodoId(todoId);

        if (todo) {
            titleInput.value = todo.title;
            descriptionTextarea.value = todo.description;
            statusSelect.value = todo.status;
        }

        renderTasks(tasks, tasksContainer);
    }

    addButton.addEventListener("click", (event) => {
        event.preventDefault();
        handleTodoSave()
    });
    showTasksButton.addEventListener("click", () => toggleTaskVisibility(true, tasksWrapper, showTasksButton));
    hideTasksButton.addEventListener("click", () => toggleTaskVisibility(false, tasksWrapper, showTasksButton));
    statusSelect.addEventListener("change", handleStatusChange);
}

/**
 * Speichert ein neues oder geändertes Todo
 */
async function handleTodoSave() {
    const {
        titleInput,
        descriptionTextarea,
        statusSelect,
        tasksContainer
    } = initDomReferences();

    const params = new URLSearchParams(window.location.search);
    const todoId = params.get("id");

    const paragraphs = tasksContainer.querySelectorAll("p");
    const taskIds = Array.from(paragraphs).map(p => parseInt(p.getAttribute("data-index"), 10));

    const todoData = {
        id: todoId ? parseInt(todoId, 10) : -1,
        title: titleInput.value,
        description: descriptionTextarea.value,
        status: statusSelect.value,
        task: taskIds
    };

    await sendItemToDB("todo", buildXmlFromObj(todoData, "todo"));
    await forwardToOverview();
}


/**
 * TODO: comment schreiben
 */
function handleStatusChange(event) {
    if (!validateBegonnenStatus(event.target.value)) console.warn("Status 'Begonnen' überschreitet das Limit.");
}

/**
 * TODO: comment schreiben
 * @param event
 */
function todoOpenTask(event) {
    if (event.target.tagName === 'P') {
        const taskId = event.target.getAttribute("data-index");
        if (taskId) location.href = `task.html?task=${taskId}`;
    }
}

/**
 * Sichtbarkeit der Taskliste toggeln
 */
function toggleTaskVisibility(show, wrapper, showButton) {
    if (show) {
        wrapper.classList.replace("containerHiddenTasksHide", "containerHiddenTasksShow");
        showButton.classList.replace("containerButtonShowTasksShow", "containerButtonShowTasksHide");
    } else {
        wrapper.classList.replace("containerHiddenTasksShow", "containerHiddenTasksHide");
        showButton.classList.replace("containerButtonShowTasksHide", "containerButtonShowTasksShow");
    }
}

/**
 * Zeigt eine Liste von Tasks im HTML an
 * @param {Array} tasks
 * @param container
 */
function renderTasks(tasks, container) {
    container.innerHTML = "";

    tasks.forEach(task => {
        const p = document.createElement("p");
        p.setAttribute("data-index", task.id);
        p.innerText = task.title;
        p.addEventListener("click", todoOpenTask);
        container.appendChild(p);
    });
}