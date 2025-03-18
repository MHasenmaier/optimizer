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

function focusSetDisplayOfPopup(todoOrTask) {
    console.log("Focus Task Toggle toggled . . .");
    if (todoOrTask === "task") {
        if (popupFocusMaxTasks.classList.contains("focusSliderPopupHide")) {
            popupFocusMaxTasks.classList.replace("focusSliderPopupHide", "focusSliderPopupShow");
            return true;
        } else {
            popupFocusMaxTasks.classList.replace("focusSliderPopupShow", "focusSliderPopupHide");
            return true;
        }
    } else if (todoOrTask === "todo") {
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

function setFocus(todoOrTask) {
    if (todoOrTask === "todo") {
        maxTodos = inputFocusMaxTodos.value;
        console.log("max Todos: " + maxTodos);
        return true;
    } else if (todoOrTask === "task") {
        maxTasks = inputFocusMaxTasks.value;
        console.log("max Tasks: " + maxTasks);
        return true;
    } else {
        console.error("js/setFocus run into an error");
        return false;
    }
}

