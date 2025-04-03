
import {fetchActiveTodosFromDBXml, urlToIndex, urlWebsiteRoot, xmlToArray} from "./services.js";
import {updateDateTime} from "./clock.js";

const bodyOverview = document.getElementById("bodyOverview");
const classContentOverview = document.querySelector('.contentOverview');
const footerOverviewAddTodoButton = document.getElementById('footerOverviewAddTodoButton');
const headerOverviewDisplayPopupMenuButton = document.getElementById("menuButton");
const classHeaderOverviewPopupMenuWindow = document.querySelector(".popupMenuWindow");
const headerOverviewFocusButton = document.getElementById('headerOverviewFocusButton');
const headerOverviewArchivButton = document.getElementById('headerOverviewArchivButton');

document.addEventListener('DOMContentLoaded', overviewPageLoaded);

async function overviewPageLoaded() {
    if (!bodyOverview) return;
    console.log("Overview loading. . .");
    updateDateTime();
    const xml = await fetchActiveTodosFromDBXml();
    await createTodoOverview(xmlToArray(xml, "todo"));
    console.log("db data: >>>   " + JSON.stringify(xml));

    classContentOverview.addEventListener('click', overviewTodoClick);
    classContentOverview.addEventListener('change', overviewCheckboxClick);
    footerOverviewAddTodoButton.addEventListener('click', overviewAddNewTodo);
    headerOverviewFocusButton.addEventListener('click', overviewLinkOpenFocus);
    headerOverviewArchivButton.addEventListener('click', overviewLinkOpenArchiv);
    headerOverviewDisplayPopupMenuButton.addEventListener("click", overviewPopupMenuWindowControl);
    headerOverviewDisplayPopupMenuButton.querySelector("span").addEventListener("click", overviewPopupMenuWindowControl);
}

/**
 * Click events
 * TODO: include return values (true/false?) for all event functions
 */
function overviewAddNewTodo() {
    console.log("New Todo will be created... soon.");

    location.href = urlWebsiteRoot + "todo.html";
}

//TODO: how to debug, if the function fails? return false?
/**
 * create html elements and provide information
 * @param todoData
 * return true if successful
 */
async function createTodoOverview(todoData) {
    classContentOverview.innerHTML = "";

    for (let i = 0; i < todoData.length; i++) {
        const todo = todoData[i];

        const div = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        const paragraph = document.createElement("p");
        paragraph.setAttribute("data-id", todo.id);
        const button = document.createElement("button");

        classContentOverview.appendChild(div);
        div.appendChild(label);
        div.appendChild(paragraph);
        div.appendChild(button);
        label.appendChild(input);

        if (todo.status === 5) input.checked = true;

        paragraph.innerText = todo.title;

        const taskCount = await countTasksForTodo(todo.id);

        if (taskCount === 0) {
            button.innerText = "ø";
            button.style.opacity = 0.5;
            button.title = "ø = keine Tasks";
        } else {
            button.innerText = taskCount.toString();
        }

    }

    return true;
}

//TODO: add return value to the function for "checkbox is checked ? yes/no"
/**
 * Function for the event if the checkbox (overview.html) is checked/unchecked
 * @param event (click event)
 */
function overviewCheckboxClick(event) {
    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
        console.log("Checkbox checked: ", event.target.parentElement.parentElement.querySelector('p').innerText);

        // Ausgabe des Inhalts des Paragraphs
        const parentDiv = event.target.parentElement.closest('div');
        const paragraph = parentDiv ? parentDiv.querySelector('p') : null;
        if (paragraph) {
            console.log("Paragraph Content:", paragraph.innerText);
        } else {
            console.error("No paragraph found.");
        }
    }
}

/**
 * function calls todo.html with an id of an already existing todo
 * @param event - click event, to check if the event is triggered by the correct html element
 */
function overviewTodoClick(event) {
    if (event.target.tagName === 'P') {
        const todoId = event.target.getAttribute("data-id");
        location.href = `todo.html?id=${todoId}`;
    }
}

/**
 * TODO: comment schreiben
 */
function overviewPopupMenuWindowControl() {
    if (classHeaderOverviewPopupMenuWindow.classList.contains('popupMenuWindowHide')) {
        console.log("show popup menu");
        classHeaderOverviewPopupMenuWindow.classList.replace('popupMenuWindowHide', 'popupMenuWindowShow');
    } else {
        console.log("hide popup menu");
        classHeaderOverviewPopupMenuWindow.classList.replace('popupMenuWindowShow', 'popupMenuWindowHide');
    }
}

/**
 * TODO:comment schreiben
 */
function overviewLinkOpenArchiv() {
    console.log("Archiv will be opened ... soon");

    location.href = urlWebsiteRoot + "archiv.html";
}

/**
 * TODO:comment schreiben
 */
function overviewLinkOpenFocus() {
    console.log("Focus mode will be opened ... soon");

    location.href = urlWebsiteRoot + "focus.html";
}

/**
 * für jedes Todo Tasks laden
 * @param todoId
 * @returns {Promise<number>}
 */
async function countTasksForTodo(todoId) {
    try {
        const response = await fetch(urlToIndex + `todotasks?todoid=${todoId}`);
        const xml = await response.text();
        const tasks = xmlToArray(xml, "task");
        return tasks.length;
    } catch (err) {
        console.error(`Fehler beim Laden der Tasks für Todo ${todoId}:`, err);
        return 0;
    }
}