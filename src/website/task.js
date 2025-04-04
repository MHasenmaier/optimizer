import {buildXmlFromObj, forwardToOverview, loadTaskById, sendItemToDB} from "./services.js";

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
    const taskId = params.get("task");

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
}

/**
 * Liest die Felder aus und speichert den Task (neu oder aktualisiert)
 */
async function handleTaskSave() {
    const { titleInput, descriptionTextarea, statusSelect } = initDomReferences();
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task");

    const isNew = taskId === null || taskId === "-1";

    const taskData = {
        id: isNew ? -1 : parseInt(taskId, 10),
        title: titleInput.value,
        description: descriptionTextarea.value,
        status: statusSelect.value
    };

    const xmlData = buildXmlFromObj(taskData, "task");
    await sendItemToDB("tasks", xmlData);

    //TODO: link zu dem todo, zu welchem dieser task gehört
    //location.href = urlWebsiteRoot + "todo.html/todo?id=X"
}
