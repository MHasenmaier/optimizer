import {buildXmlFromItem, forwardToOverview, getTasksFromDBAsXml, sendTaskToDB, xmlToArray} from "./services.js";
import {statusPopupTodo} from "./todo";

const taskBody = document.getElementById("taskBody");
const btnAddTask = document.getElementById("buttonAddTask");
const taskTitleInput = document.getElementById("labelItemTitle");
const taskDescriptionTextarea = document.getElementById("textareaItemDescription");


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
    await sendTaskToDB(xmlData);
    forwardToOverview();
}

/** TODO: comment schreiben
 * Lädt die Task-Daten und füllt die Felder aus.
 */
function setTaskData(taskId) {
    const allTasks = xmlToArray(getTasksFromDBAsXml(), "task");
    const specificTask = allTasks.find(task => String(task.id) === taskId);

    if (specificTask) {
        taskTitleInput.value = specificTask.title;
        taskDescriptionTextarea.value = specificTask.description;
        statusPopupTodo.value = specificTask.status;
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

    const taskData = {
        id: isNew ? -1 : taskId,
        title: taskTitleInput.value,
        description: taskDescriptionTextarea.value,
        status: statusPopupTodo.value
    };
    const xmlString = buildXmlFromItem(taskData, "task");
    return sendTaskToDB(xmlString);
}