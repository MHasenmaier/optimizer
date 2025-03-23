import {getTodosFromDBAsXml, getTasksFromDBAsXml, urlWebsiteRoot, xmlToArray} from "./services.js";
import {updateDateTime} from "./clock.js";
import {bodyTodoPage, showExistingTodo} from "./todo.js";

const bodyOverview = document.getElementById("bodyOverview");
const classContentOverview = document.querySelector('.contentOverview');
const footerOverviewAddTodoButton = document.getElementById('footerOverviewAddTodoButton');
const headerOverviewDisplayPopupMenuButton = document.getElementById("menuButton");
const classHeaderOverviewPopupMenuWindow = document.querySelector(".popupMenuWindow");
const headerOverviewFocusButton = document.getElementById('headerOverviewFocusButton');
const headerOverviewArchivButton = document.getElementById('headerOverviewArchivButton');

document.addEventListener('DOMContentLoaded', overviewPageLoaded);

function overviewPageLoaded () {
    if (bodyOverview) {
        console.log("Overview loading. . .");
        updateDateTime();
        createTodoOverview(xmlToArray(getTodosFromDBAsXml()));    //TODO: mocked data
        console.log("debug mock data: " + JSON.stringify(xmlToArray(getTodosFromDBAsXml())));

        classContentOverview.addEventListener('click', overviewTodoClick);
        classContentOverview.addEventListener('change', overviewCheckboxClick);
        footerOverviewAddTodoButton.addEventListener('click', overviewAddNewTodo);
        headerOverviewFocusButton.addEventListener('click', overviewLinkOpenFocus);
        headerOverviewArchivButton.addEventListener('click', overviewLinkOpenArchiv);
        headerOverviewDisplayPopupMenuButton.addEventListener("click", overviewPopupMenuWindowControl);
        headerOverviewDisplayPopupMenuButton.querySelector("span").addEventListener("click", overviewPopupMenuWindowControl);
    }
}

/**
 * Click events
 * TODO: include return values (true/false?) for all event functions
 */
function overviewAddNewTodo() {
    console.log("New Todo will be created... soon.");

    location.href = urlWebsiteRoot + "todo.html";
}

/**
 * set up the html files with content from the DB
 */

//TODO: how to debug, if the function fails? return false?
/**
 * create html elements and provide information
 * @param todoData
 * return true if successful
 */
function createTodoOverview(todoData) {
    classContentOverview.innerHTML = "";
    todoData.forEach((todo, arrayIndex) => {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        const paragraph = document.createElement("p");
        paragraph.setAttribute("data-index", arrayIndex);
        const button = document.createElement("button");

        classContentOverview.appendChild(div);
        div.appendChild(label);
        div.appendChild(paragraph);
        div.appendChild(button);
        label.appendChild(input);

        if (todo.status === 5) {
            input.checked = true;
        }

        paragraph.innerText = todo.title;
        button.innerText = todo.task.length.toString();
    });

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

async function overviewTodoClick(event) {
    console.log("Todo ->" + event + "<- clicked.");

    await overviewLinkOpenTodo;
    await bodyTodoPage;
    showExistingTodo(overviewCollectDataOfClickedItem(event));
}

/**
 * Function for the event if the title of a todo (overview.html) is clicked
 * @param event (click event)
 */
function overviewCollectDataOfClickedItem(event) {
    if (event.target.tagName === 'P') {  //click todo
        console.log("Paragraph clicked:", event.target.innerText);
        const index = event.target.getAttribute("data-index");
        const element = xmlToArray(getTodosFromDBAsXml())[index];
        console.log("JSON element = " + JSON.stringify(element));
        return element;
    }
}

/**
 * 1. function um click entgegen zu nehmen
 * 2. function um todo objekt temporär zu speichern
 * [ok] 3. function um neue seite aufzurufen
 *  -->     overviewLinkOpenTodo
 * 4. function um bei seitenaufruf mit todo objekt info felder zu befüllen
 *
 *         //TODO: include DB content like: const dbTodo = urlToIndex + "?id=" + element.id;
 *         const dbTodo = "imagine here is what the DB contains" //TODO: connect the DB here
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

function overviewLinkOpenTodo() {
    location.href = urlWebsiteRoot + "todo.html"; //TODO: work-around entfernen /?id=" + element.id;
}

function overviewLinkOpenArchiv() {
    console.log("Archiv will be opened ... soon");

    location.href = urlWebsiteRoot + "archiv.html";
}

function overviewLinkOpenFocus() {
    console.log("Focus mode will be opened ... soon");

    location.href = urlWebsiteRoot + "focus.html";
}
