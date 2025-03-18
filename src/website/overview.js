import {mockXMLDataTodo, urlWebsiteRoot, xmlToArray} from "./services.js";

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
        createTodoOverview(xmlToArray(mockXMLDataTodo));    //TODO: mocked data
        console.log(xmlToArray(mockXMLDataTodo));

        classContentOverview.addEventListener('click', overviewTodoClick);
        classContentOverview.addEventListener('change', overviewCheckboxClick);
        footerOverviewAddTodoButton.addEventListener('click', overviewAddNewTodo);  //TODO: better function name
        headerOverviewFocusButton.addEventListener('click', overviewLinkOpenFocus);
        headerOverviewArchivButton.addEventListener('click', overviewLinkOpenArchiv);
        headerOverviewDisplayPopupMenuButton.addEventListener("click", overviewPopupMenuWindowControl);
        //FIXME: bug! bei klick wird das fenster nicht zuverlässig geöffnet/geschlossen
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
    const contentOverview = document.querySelector(".contentOverview");
    contentOverview.innerHTML = "";

    todoData.forEach((todo, arrayIndex) => {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        const paragraph = document.createElement("p");
        paragraph.setAttribute("data-index", arrayIndex);
        const button = document.createElement("button");

        contentOverview.appendChild(div);
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


/**
 * Function for the event if the checkbox (overview.html) is checked/unchecked
 * @param event (click event)
 */
function overviewCheckboxClick(event) {
    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {  //change on checkbox
        //TODO: debugging output
        console.log("Checkbox checked: ", event.target.parentElement.parentElement.querySelector('p').innerText);

        // Ausgabe des Inhalts des Paragraphs
        const parentDiv = event.target.parentElement.closest('div');
        console.log("Parent div found:", parentDiv);
        const paragraph = parentDiv ? parentDiv.querySelector('p') : null;
        console.log("Paragraph element:", paragraph);
        if (paragraph) {
            console.log("Paragraph Content:", paragraph.innerText);
        } else {
            console.log("No paragraph found.");
        }
    }
}

/**
 * Function for the event if the title of a todo (overview.html) is clicked
 * @param event (click event)
 */
function overviewTodoClick(event) {
    if (event.target.tagName === 'P') {  //click todo
        //FIXME: mock output for debugging
        console.log("Paragraph clicked:", event.target.innerText);
        const index = event.target.getAttribute("data-index");
        const element = xmlToArray(mockXMLDataTodo)[index];
        //TODO: include DB content
        //FIXME: at fetchDBTodo() function
        const dbTodo = fetchDBTodo(index);
        console.log(element);
        console.log("from DB:\n" + dbTodo);
        //open link todo page

        //id of requested todo in URL
        //TODO: informationsübertrag funktioniert noch nicht korrekt
        //TODO: 1. index.php öffnen -> 2. php öffnet todo-html
        location.href = urlWebsiteRoot + "todo.html"; //TODO: work-around entfernen /?id=" + element.id;
    }
}

function overviewPopupMenuWindowControl() {
    if (classHeaderOverviewPopupMenuWindow.classList.contains('popupMenuWindowHide')) {
        console.log("show popup menu");
        classHeaderOverviewPopupMenuWindow.classList.replace('popupMenuWindowHide', 'popupMenuWindowShow');
    } else {
        console.log("hide popup menu");
        classHeaderOverviewPopupMenuWindow.classList.replace('popupMenuWindowShow', 'popupMenuWindowHide');
    }
}

function overviewLinkOpenArchiv() {
    console.log("Archiv will be opened ... soon");

    location.href = urlWebsiteRoot + "archiv.html";
}

function overviewLinkOpenFocus() {
    console.log("Focus mode will be opened ... soon");

    location.href = urlWebsiteRoot + "focus.html";
}
