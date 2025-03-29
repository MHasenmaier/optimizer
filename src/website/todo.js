import {
    buildXmlFromObj,
    forwardToOverview,
    sendItemToDB,
    urlWebsiteRoot,
    validateBegonnenStatus,
    xmlToArray
} from "./services.js";
import {getTodosFromDBAsXml} from "./mockdata.js";

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

let todos = xmlToArray(getTodosFromDBAsXml(), "todo");

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
async function handleTodoSave() {
    const xmlData = collectDataNewTodo();
    await forwardToOverview();
    await sendItemToDB("todo", buildXmlFromObj(xmlData,"todo"));
}

/**
 * TODO: comment schreiben
 */
function handleStatusChange() {
    console.log("Platzhalter bei status änderung durch this.value: " + this.value);
    if (validateBegonnenStatus("todo", this.value)) {
        console.log("Status erlaubt.");
    } else {
        console.warn("Status nicht erlaubt. Zu viele todo auf 'Begonnen'");
    }
}

/**
 * TODO: comment schreiben
 * collects data from the textarea, input, dropdown and task, returns obj {}
 * @returns {{id: number, title: *, description: *, status, task: *[]}}
 */
function collectDataNewTodo() {
    const paragraphs = classContainerHiddenTasksContainedTasks.querySelectorAll("p");
    const dataIndices = [];

    paragraphs.forEach(p => {
        const dataIndex = p.getAttribute("data-index");
        if (dataIndex) {
            dataIndices.push(parseInt(dataIndex, 10));
        }
    });

    return {
        id: -1,
        title: todoTitleInput.value,
        description: todoDescriptionTextarea.value,
        status: statusPopupTodo.options[statusPopupTodo.selectedIndex].value,
        task: dataIndices
    };
}

/**
 * TODO: comment schreiben
 * @param event
 */
function todoOpenTask(event) {
    if (event.target.tagName === 'P') {
        const taskId = event.target.getAttribute("data-index");
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

