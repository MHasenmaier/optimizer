import {
    forwardToOverview,
    getTodosFromDBAsXml,
    saveStatus,
    sendTodoToDB,
    urlWebsiteRoot,
    xmlToArray
} from "./services.js";

export const bodyTodoPage = document.getElementById("bodyTodoPage");

const classContainerHiddenTasksContainedTasks = document.querySelector(".containerHiddenTasksContainedTasks");
const classContainerHiddenTasks = document.querySelector(".containerHiddenTasks");
export const statusPopupTodo = document.getElementById("statusPopupTodo");
const todoTitleInput = document.getElementById("todoTitleInput");
const todoDescriptionTextarea = document.getElementById("todoDescriptionTextarea");
const btnTodoAddTodo = document.getElementById("buttonAddTodo");
const btnTodoShowTasks = document.getElementById("buttonShowTasks");
const btnTodoHideTasks = document.getElementById("buttonHideTasks");

document.addEventListener('DOMContentLoaded', todoPageLoaded);

let todos = xmlToArray(getTodosFromDBAsXml());

function todoPageLoaded() {
    if (!bodyTodoPage) return;

    console.log("Todo page loading...");

    // Daten aus der URL holen und in die Felder eintragen
    const params = new URLSearchParams(window.location.search);
    const index = params.get("index");

    if (index !== null) {
        setTodoData(index);
    }

    // Event-Listener für Buttons und Interaktionen setzen
    btnTodoAddTodo.addEventListener("click", handleTodoSave);
    btnTodoShowTasks.addEventListener("click", todoDisplayToggleTasks);
    btnTodoHideTasks.addEventListener("click", todoDisplayToggleTasks);

    const taskParagraph = classContainerHiddenTasksContainedTasks.querySelector("p");
    if (taskParagraph) {
        taskParagraph.addEventListener("click", todoOpenTask);
    }

    statusPopupTodo.addEventListener("change", handleStatusChange);
}

/**
 * TODO: comment schreiben
 * @param index
 */
function setTodoData(index) {
    const todo = todos[index];

    if (todo) {
        todoTitleInput.value = todo.title;
        todoDescriptionTextarea.value = todo.description;
        statusPopupTodo.value = todo.status;
    }
}

/**
 * TODO: comment schreiben
 */
function handleTodoSave() {
    const xmlData = collectData();
    sendTodoToDB(xmlData);
    forwardToOverview();
}


/**
 * TODO: comment schreiben
 */
function handleStatusChange() {
    saveStatus("todo", statusPopupTodo.options[statusPopupTodo.selectedIndex].value);
}

/**
 * TODO: comment schreiben
 * @returns {string}
 */
function collectData() {
    const paragraphs = classContainerHiddenTasksContainedTasks.querySelectorAll("p");
    const dataIndices = [];

    paragraphs.forEach(p => {
        const dataIndex = p.getAttribute("data-index");
        if (dataIndex) {
            dataIndices.push(parseInt(dataIndex, 10));
        }
    });

    const newTodoObj = {
        id: -1, // Neues Todo bekommt -1 als ID
        title: todoTitleInput.value,
        description: todoDescriptionTextarea.value,
        status: statusPopupTodo.options[statusPopupTodo.selectedIndex].value,
        task: dataIndices
    };

    return convertTodoToXml(newTodoObj);
}

/**
 * TODO: comment schreiben
 * @param todo
 * @returns {string}
 */
function convertTodoToXml(todo) {
    return `
    <todo>
        <id>${todo.id}</id>
        <title>${todo.title}</title>
        <description>${todo.description}</description>
        <status>${todo.status}</status>
        <tasks>
            ${todo.task.map(taskId => `<task>${taskId}</task>`).join("\n")}
        </tasks>
    </todo>`;
}

/**
 * TODO: comment schreiben
 * @param event
 */
function todoOpenTask(event) {
    if (event.target.tagName === 'P') {
        const taskId = event.target.getAttribute("data-task-id");
        if (taskId) {
            location.href = `task.html?task=${taskId}`;
        }
    }
}

/**
 * TODO: comment schreiben
 */
function todoDisplayToggleTasks() {
    if (classContainerHiddenTasks.classList.contains('containerHiddenTasksHide')) {
        console.log("show tasks");
        classContainerHiddenTasks.classList.replace('containerHiddenTasksHide', 'containerHiddenTasksShow');
        btnTodoShowTasks.classList.replace('containerButtonShowTasksShow', 'containerButtonShowTasksHide');
    } else {
        console.log("hide tasks");
        classContainerHiddenTasks.classList.replace('containerHiddenTasksShow', 'containerHiddenTasksHide');
        btnTodoShowTasks.classList.replace('containerButtonShowTasksHide', 'containerButtonShowTasksShow');
    }
}

