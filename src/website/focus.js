import {forwardToOverview, getFocusDataFromDB, parser} from "./services.js";

const bodyFocus = document.getElementById("bodyFocus");
const slideTodoFocus = document.getElementById("focusTodoCheck");
const slideTaskFocus = document.getElementById("focusTaskCheck");
const popupFocusMaxTodos = document.getElementById("focusMaxTodosPopup");
const popupFocusMaxTasks = document.getElementById("focusMaxTasksPopup");
const inputFocusMaxTodos = document.getElementById("focusMaxTodos");
const inputFocusMaxTasks = document.getElementById("focusMaxTasks");
const btnFocusBack = document.getElementById("closeFocusButton");

//TODO: temporär globale variable
let maxTodos = 1;
let maxTasks = 1;

document.addEventListener("DOMContentLoaded", focusPageLoaded);

function focusPageLoaded() {
    if (!bodyFocus) return;
    console.log("Focus page loaded . . .");

    loadFocusSettings();

    slideTodoFocus.addEventListener("change", () => focusSetDisplayOfPopup("todo"));
    slideTaskFocus.addEventListener("change", () => focusSetDisplayOfPopup("task"));
    btnFocusBack.addEventListener("click", () => closePageAndSetFocusEvent());
}

/**
 * get focus data from db and set value
 */
function loadFocusSettings() {
    const xmlString = getFocusDataFromDB(); // Holt den XML-String
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    maxTodos = parseInt(xmlDoc.querySelector("todo > anzahl").textContent, 10);
    maxTasks = parseInt(xmlDoc.querySelector("task > anzahl").textContent, 10);

    inputFocusMaxTodos.value = maxTodos;
    inputFocusMaxTasks.value = maxTasks;
}

/** show/hide the popup window
 * Change the display property of the popup window if slider is toggled
 * @param todoOrTask  expects a string what the toggled item is named for
 * @returns {boolean}   true if the function was successful / false if an error occurs
 */
function focusSetDisplayOfPopup(todoOrTask) {
    if (todoOrTask === "task") {
        console.log("Focus Task Toggle toggled . . .");
        if (popupFocusMaxTasks.classList.contains("focusSliderPopupHide")) {
            popupFocusMaxTasks.classList.replace("focusSliderPopupHide", "focusSliderPopupShow");
            return true;
        } else {
            popupFocusMaxTasks.classList.replace("focusSliderPopupShow", "focusSliderPopupHide");
            return true;
        }
    } else if (todoOrTask === "todo") {
        console.log("Focus Todo Toggle toggled . . .");
        if (popupFocusMaxTodos.classList.contains("focusSliderPopupHide")) {
            popupFocusMaxTodos.classList.replace("focusSliderPopupHide", "focusSliderPopupShow");
            return true;
        } else {
            popupFocusMaxTodos.classList.replace("focusSliderPopupShow", "focusSliderPopupHide");
            return true;
        }
    } else {
        console.error("Error in js/focusSetFocus");
        return false;
    }
}

/**
 * Event handles what happen if user click the "Zurück" button
 */
function closePageAndSetFocusEvent() {
    setFocus();
    forwardToOverview();
}

/**
 * TODO: comment schreiben
 * @param todo
 * @param task
 */
export function saveFocusDataToDB(todo, task) {
    const xmlData = `
    <focus>
        <todo>
            <anzahl>${todo}</anzahl>
        </todo>
        <task>
            <anzahl>${task}</anzahl>
        </task>
    </focus>`;

    console.log("MOCK: Speichere Fokus-Daten als XML:", xmlData);

    // TODO: Hier später den echten API-Call einfügen
    /*
    fetch("/api/focus", {
        method: "POST",
        headers: { "Content-Type": "application/xml" },
        body: xmlData,
    });
    */
}

/**
 * TODO: comment schreiben
 */
function setFocus() {
    maxTodos = inputFocusMaxTodos.value;
    console.log("max Todos: " + maxTodos);

    maxTasks = inputFocusMaxTasks.value;
    console.log("max Tasks: " + maxTasks);

    saveFocusDataToDB(maxTodos, maxTasks)
}