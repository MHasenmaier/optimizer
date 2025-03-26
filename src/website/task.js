import {getTasksFromDBAsXml, saveStatus, xmlToArray} from "./services.js";

const bodyTask = document.getElementById("taskBody");

export const statusPopupTask = document.getElementById("statusPopupTask");

document.addEventListener('DOMContentLoaded', taskPageSetup);

function taskPageSetup() {
    if (!bodyTask) return;

    console.log("Task page loading...");

    const params = new URLSearchParams(window.location.search);
    const taskId = params.get("task");

    if (taskId !== null) {
        setTaskData(taskId);
    }
}

function setTaskData(taskId) {
    const tasks = xmlToArray(getTasksFromDBAsXml());
    const task = tasks.find(t => t.id === Number(taskId));

    if (task) {
        document.getElementById("labelItemTitle").value = task.title;
        document.getElementById("textareaItemDescription").value = task.description;
        document.getElementById("statusPopupTask").value = task.status;
    } else {
        console.error("Task nicht gefunden!");
    }
}

