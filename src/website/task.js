import {buildXmlFromObj, forwardToOverview, sendItemToDB, xmlToArray} from "./services.js";
import {statusPopupTodo} from "./todo.js";
import {getTasksFromDBAsXml} from "./mockdata.js";

const taskBody = document.getElementById("taskBody");
const btnAddTask = document.getElementById("buttonAddTask");
const taskTitleInput = document.getElementById("labelItemTitle");
const taskDescriptionTextarea = document.getElementById("textareaItemDescription");
export const statusPopupTask = document.getElementById("statusPopupTask")


document.addEventListener('DOMContentLoaded', taskPageSetup);

function taskPageSetup() {
    if (!taskBody) return;

    console.log("Task page loading...");

    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task");

    if (taskId !== null) {
        setTaskData(taskId);
    }

    btnAddTask.addEventListener("click", handleTaskSave);
}

/**TODO: comment schreiben
 * saves or updates a task
 */
async function handleTaskSave() {
    const xmlData = saveOrUpdateTask();
    await sendItemToDB('tasks', xmlData);
    forwardToOverview();
}

/** TODO: comment schreiben
 * Lädt die Task-Daten und füllt die Felder aus.
 */
function setTaskData(taskId) {
    const allTasks = xmlToArray(getTasksFromDBAsXml(), "task");
    const specificTask = allTasks.find(task => String(task.id) === taskId);

    if (specificTask) {
        console.log("Task contains: " + JSON.stringify(specificTask));
        taskTitleInput.value = specificTask.title;
        taskDescriptionTextarea.value = specificTask.description;
        statusPopupTask.value = specificTask.status;
    } else {
        console.error("Task nicht gefunden!");
    }
}

/**
 * creates a new task or updates an existing one
 * @returns {*} XML-string
 */
function saveOrUpdateTask() {
    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task");

    const isNew = taskId === null || taskId === "-1";

    isNew ? console.log("Neuer Task angelegt") : console.log("Task wurde aktualisiert");

    const taskData = {
        id: isNew ? -1 : taskId,
        title: taskTitleInput.value,
        description: taskDescriptionTextarea.value,
        status: statusPopupTask.value
    };
    const xmlString = buildXmlFromObj(taskData, "task");
    return sendItemToDB("task", xmlString)
}