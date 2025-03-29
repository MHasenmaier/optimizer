import {forwardToOverview, getFocusLimits} from "./services.js";

const bodyFocus = document.getElementById("bodyFocus");
const slideTodoFocus = document.getElementById("focusTodoCheck");
const slideTaskFocus = document.getElementById("focusTaskCheck");
const popupFocusMaxTodos = document.getElementById("focusMaxTodosPopup");
const popupFocusMaxTasks = document.getElementById("focusMaxTasksPopup");
const inputFocusMaxTodos = document.getElementById("focusMaxTodos");
const inputFocusMaxTasks = document.getElementById("focusMaxTasks");
const btnFocusBack = document.getElementById("closeFocusButton");

document.addEventListener("DOMContentLoaded", focusPageLoaded);

function focusPageLoaded() {
    if (!bodyFocus) return;
    console.log("Focus page loaded . . .");

    loadFocusSettings();

    slideTodoFocus.addEventListener("change", () => focusSetDisplayOfPopup("todo"));
    slideTaskFocus.addEventListener("change", () => focusSetDisplayOfPopup("task"));
    btnFocusBack.addEventListener("click", () => closePageAndSetFocusEvent());
}

/**get focus data from db and set value
 * @function loadFocusSettings
 * @description Loads focus settings from the backend (or mock) and applies them to the form fields.
 */
function loadFocusSettings() {
    try {
        const todoLimits = getFocusLimits("todo");
        const taskLimits = getFocusLimits("task");
        inputFocusMaxTodos.value = todoLimits;
        inputFocusMaxTasks.value = taskLimits;
        console.log("Fokus-Einstellungen geladen:\nTodo: " + todoLimits + "\nTask: " + taskLimits);
    } catch (error) {
        console.error("Fehler beim Laden der Fokus-Einstellungen:", error);
    }
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

/** TODO: comment schreiben / console.logs schreiben
 * Beim Klick auf "Zurück" wird setFocus() aufgerufen.
 * Abhängig vom Rückgabewert wird eine Erfolgsmeldung ausgegeben und forwardToOverview() aufgerufen,
 * oder es erscheint eine Warnung in der Konsole.
 */
async function closePageAndSetFocusEvent() {
    const success = await setFocus();
    if (success) {
        console.log("Fokus-Daten erfolgreich gespeichert. Wechsle zur Übersicht.");
        forwardToOverview();
    } else {
        console.warn("Warnung: Fokus-Daten konnten nicht gespeichert werden. Wechsel zur Übersicht abgebrochen.");
    }
}

/**
 * TODO: comment schreiben
 * @param howManyTodos
 * @param howManyTasks
 */
export async function saveFocusDataToDB(howManyTodos, howManyTasks) {
    const xmlData = `
    <focus>
        <todo>
            <anzahl>${howManyTodos}</anzahl>
        </todo>
        <task>
            <anzahl>${howManyTasks}</anzahl>
        </task>
    </focus>`;
    console.log("MOCK: Speichere Fokus-Daten als XML:", xmlData);
    // Echter API-Aufruf – auskommentiert:
    /*
    try {
        const response = await fetch(urlToIndex + 'focus', {
            method: 'POST',
            headers: { 'Content-Type': 'application/xml' },
            body: xmlData,
        });
        const data = await response.text();
        console.log("Fokus-Daten erfolgreich gespeichert:", data);
    } catch (error) {
        console.error("Fehler beim Speichern der Fokus-Daten:", error);
    }
    */
}

/** TODO: comment schreiben
 * Liest die aktuellen Fokus-Werte aus den Eingabefeldern,
 * speichert diese via saveFocusDataToDB() und gibt true zurück,
 * wenn die Daten erfolgreich übertragen wurden, andernfalls false.
 */
async function setFocus() {
    // Lese die aktuellen Werte aus den Input-Feldern und speichere sie in einem Objekt
    const focusLimits = {
        todos: inputFocusMaxTodos.value,
        tasks: inputFocusMaxTasks.value
    };

    console.log("max Todos: " + focusLimits.todos);
    console.log("max Tasks: " + focusLimits.tasks);

    try {
        await saveFocusDataToDB(focusLimits.todos, focusLimits.tasks);
        return true;
    } catch (error) {
        console.error("Fehler beim Speichern der Fokus-Daten:", error);
        return false;
    }
}
