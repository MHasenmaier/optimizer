import {buildXmlFromObj, forwardToOverview, loadTaskById, sendItemToDB, validateBegonnenStatus} from "./services.js";

document.addEventListener("DOMContentLoaded", async () => {
    await taskPageLoaded();
});
function initDomReferences() {
    return {
        body: document.getElementById("taskBody"),
        titleInput: document.getElementById("labelItemTitle"),
        descriptionTextarea: document.getElementById("textareaItemDescription"),
        statusSelect: document.getElementById("statusPopupTask"),
        saveButton: document.getElementById("buttonAddTask")
    };
}

async function taskPageLoaded() {
    const { body, titleInput, descriptionTextarea, statusSelect, saveButton } = initDomReferences();

    if (!body) return;
    console.log("Task page loading...");

    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("id");

    if (taskId !== null && taskId !== "-1") {
        const task = await loadTaskById(taskId);
        if (task) {
            titleInput.value = task.title;
            descriptionTextarea.value = task.description;
            statusSelect.value = task.status;
        } else {
            console.warn(`Kein Task mit ID ${taskId} gefunden.`);
        }
    }

    saveButton.addEventListener("click", handleTaskSave);
    statusSelect.addEventListener("change", handleStatusChange);
}

/**
 * Liest die Felder aus und speichert den Task (neu oder aktualisiert),
 * sofern der gesetzte Status erlaubt ist.
 */
async function handleTaskSave() {
    const { titleInput, descriptionTextarea, statusSelect } = initDomReferences();
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("id");
    const isNew = taskId === null || taskId === "-1";

    const selectedStatus = statusSelect.value;

    const isValid = await validateBegonnenStatus("task", selectedStatus);
    let saveStatusSelect = statusSelect.style.border;
    if (!isValid) {
        statusSelect.style.border = "2px solid red";
        statusSelect.focus();
        return;
    }

    statusSelect.style.border = saveStatusSelect;

    const taskData = {
        id: isNew ? -1 : parseInt(taskId, 10),
        title: titleInput.value,
        description: descriptionTextarea.value,
        status: selectedStatus
    };

    const xmlData = buildXmlFromObj(taskData, "task");
    await sendItemToDB("task", xmlData);
}


/**
 * Event-Handler für die Statusänderung bei Tasks
 * Gibt Warnung aus, falls Limit für "Begonnen" überschritten würde
 */
async function handleStatusChange(event) {
    const isValid = await validateBegonnenStatus("task", event.target.value);
    if (!isValid) {
        console.warn("Status 'Begonnen' für Task nicht erlaubt – Limit erreicht.");
    }
}
