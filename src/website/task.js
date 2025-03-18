import {saveStatus} from "./services.js";

const bodyTask = document.getElementById("taskBody");

export const statusPopupTask = document.getElementById("statusPopupTask");

document.addEventListener("DOMContentLoaded", taskPageLoaded);

function taskPageLoaded () {
    if (bodyTask) {
        console.log("Task page loading . . .");
        statusPopupTask.addEventListener("change", () => saveStatus(
            "task",
            statusPopupTask.options[statusPopupTask.selectedIndex].value
        ));
    }
}

function taskToXmlFormatter(inputObj) {
    const xmlTask = `
        <task>
            <id>${inputObj.id}</id>
            <title>${inputObj.title}</title>
            <description>${inputObj.description}</description>
            <status>${inputObj.status}</status>
        </task>`;
    console.log("Task formatted: \n" + xmlTask);
    return xmlTask;
}