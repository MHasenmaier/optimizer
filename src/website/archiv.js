import {fetchInactiveTodosFromDBXml, forwardToOverview, xmlToArray} from "./services.js";

const bodyArchiv = document.getElementById("doneBody");
const bodyDeleted = document.getElementById("deletedBody");
const btnCloseArchiv = document.getElementById("closeArchivButton");
const headerButtons = document.querySelectorAll(".archivHeader button");
const mainSection = document.querySelector(".archivMainSection");

document.addEventListener("DOMContentLoaded", archivDeletedPageLoaded);

document.addEventListener("DOMContentLoaded", async () => {
    await archivDeletedPageLoaded();
    mainSection.addEventListener("click", archivDeletedItemClick);
    btnCloseArchiv.addEventListener("click", forwardToOverview);
});


/**
 * @function archivDeletedPageLoaded
 * @description Erkennt, auf welcher Seite wir sind und lädt passende Todos (status 5 oder 1).
 */
async function archivDeletedPageLoaded() {
    if (!bodyArchiv && !bodyDeleted) {
        console.warn("Weder 'doneBody' noch 'deletedBody' gefunden – Abbruch");
        return;
    }

    const xml = await fetchInactiveTodosFromDBXml();
    const allInactiveTodos = xmlToArray(xml, "todo");

    let relevantTodos = [];
    let mode = "";

    if (bodyArchiv) {
        relevantTodos = allInactiveTodos.filter(todo => todo.status === 5);
        mode = "Archiv (status=5)";
    } else if (bodyDeleted) {
        relevantTodos = allInactiveTodos.filter(todo => todo.status === 1);
        mode = "Deleted (status=1)";
    }

    console.log(`Lade Seite: ${mode}. Anzahl gefundener Todos: `, relevantTodos.length);

    renderItems(relevantTodos);

    initHeaderButtons();
}

/**
 * @function renderItems
 * @description Rendert die Todo-Objekte im HTML
 * @param {Array} todos
 */
function renderItems(todos) {
    if (!mainSection) {
        console.warn("Kein .archivMainSection vorhanden, kann nichts rendern.");
        return;
    }

    mainSection.innerHTML = "";
    todos.forEach(todo => {
        const itemDiv = createItemDiv(todo);
        mainSection.appendChild(itemDiv);
    });
}

/**
 * @function createItemDiv
 * @description Erzeugt ein <div> mit Datum + Title
 * @param {Object} todo
 * @returns {HTMLDivElement}
 */
function createItemDiv(todo) {
    const containerDiv = document.createElement("div");
    containerDiv.dataset.id = todo.id;

    const pDate = document.createElement("p");
    pDate.innerText = todo.lastUpdate;

    const pTitle = document.createElement("p");
    pTitle.innerText = todo.title;

    containerDiv.appendChild(pDate);
    containerDiv.appendChild(pTitle);

    return containerDiv;
}

/**
 * @function initHeaderButtons
 * @description Weist den beiden Buttons "Beendet" und "Gelöscht" eine Klickaktion zu.
 *              Einer davon führt zur archiv.html, der andere zur deleted.html
 */
function initHeaderButtons() {
    if (!headerButtons || headerButtons.length < 2) {
        console.warn("Erwarte 2 Header-Buttons, aber gefunden:", headerButtons.length);
        return;
    }

    if (bodyArchiv) {
        headerButtons[0].style.borderBottom = "2px solid red";
        headerButtons[1].addEventListener("click", () => {
            location.href = "deleted.html";
        });

    } else {
        headerButtons[1].style.borderBottom = "2px solid red";
        headerButtons[0].addEventListener("click", () => {
            location.href = "archiv.html";
        });
    }
}

/**
 * Reagiert auf Klicks in der archivMainSection / deletedMainSection
 * und öffnet das Todo in todo.html
 * @param {MouseEvent} event
 */
function archivDeletedItemClick(event) {
    const clickedDiv = event.target.closest("div[data-id]");
    if (!clickedDiv) return;

    const todoId = clickedDiv.dataset.id;
    if (!todoId) {
        console.warn("Kein data-id vorhanden.");
        return;
    }

    location.href = `todo.html?id=${todoId}`;
}