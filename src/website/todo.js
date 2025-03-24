import {forwardToOverview, getTodosFromDBAsXml, saveStatus, urlWebsiteRoot, xmlToArray} from "./services.js";

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
    btnTodoAddTodo.addEventListener("click", () => saveOrUpdateTodo(index));
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
 * @param index
 */
function saveOrUpdateTodo(index) {
    const updatedTodo = {
        id: index !== null ? todos[index].id : todos.length + 1, // use already existing todo or create a new one
        title: todoTitleInput.value,
        description: todoDescriptionTextarea.value,
        status: statusPopupTodo.value,
    };

    if (index !== null) {
        //update todo
        todos[index] = updatedTodo;
        console.log(`Todo mit Index ${index} aktualisiert:`, updatedTodo);
    } else {
        //create new todo
        todos.push(updatedTodo);
        console.log("Neues Todo hinzugefügt:", updatedTodo);
    }

    console.log("Aktualisierte Todos:", todos);

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
 * @returns {{id: number, title, description, status, task: *[]}}
 */
function collectData() {
    let todoArray = getTodosFromDBAsXml();

    const paragraphs = classContainerHiddenTasksContainedTasks.querySelectorAll("p");
    const dataIndices = [];

    //TODO: ist das sinnvoll? "neuer task erstellen" fragt id von db an und zeigt hier nur die ids an
    paragraphs.forEach(p => {
        const dataIndex = p.getAttribute("data-index");
        if (dataIndex) {
            dataIndices.push(parseInt(dataIndex, 10));
        }
    })

    const newTodoObj = {
        id: -1, //-1 => placeholder for new Todo, real ID given by DB
        title: todoTitleInput.value,
        description: todoDescriptionTextarea.value,
        status: statusPopupTodo.options[statusPopupTodo.selectedIndex].value,
        task: dataIndices
    }

    //TODO: mock data!
    //FIXME: compiler throws "not a function"-error
    //todoArray.push(newTodoObj);

    console.log("New Todo: " + JSON.stringify(newTodoObj));
    console.log("todoArray: " + JSON.stringify(todoArray));

    return newTodoObj;
}

/**
 * TODO: comment schreiben
 * @param event
 */
function todoOpenTask(event) {
    console.log("Task clicked: " + event.target.innerText);

    location.href = urlWebsiteRoot + "task.html"; //TODO: mock work-around! für prod einfügen: /?id=" + element.id;
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

/**
 * TODO: still needed?
 * TODO: comment schreiben
 * @param todoOrTask
 * @param inputObj
 * @returns {string}
 */
function todoTaskToXmlFormatter(todoOrTask, inputObj) {
    if (todoOrTask === "todo") {
        const xmlTodo = `
        <todo>
            <id>${inputObj.id}</id>
            <title>${inputObj.title}</title>
            <description>${inputObj.description}</description>
            <status>${inputObj.status}</status>
            <tasks>
                ${inputObj.task}
            </tasks>
        </todo>`;
        console.log(xmlTodo);
        return xmlTodo;
    } else if (todoOrTask === "task") {
        const xmlTask = `
        <task>
            <id>${inputObj.id}</id>
            <title>${inputObj.title}</title>
            <description>${inputObj.description}</description>
            <status>${inputObj.status}</status>
        </task>`;
        console.log("Task array -> task xml start . . ." + xmlTask);
    } else {
        console.error("todo.js/arrayToXmlFormatter didnt get /todo nor /task as a first parameter . . .");
    }
}

