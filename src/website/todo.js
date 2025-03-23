import {saveStatus, urlWebsiteRoot, xmlToArray} from "./services.js";

export const bodyTodoPage = document.getElementById("bodyTodoPage");

const classContainerHiddenTasksContainedTasks = document.querySelector(".containerHiddenTasksContainedTasks");
const classContainerHiddenTasks = document.querySelector(".containerHiddenTasks");
export const statusPopupTodo = document.getElementById("statusPopupTodo");
const todoTitleInput = document.getElementById("todoTitleInput");
const todoDescriptionTextarea = document.getElementById("todoDescriptionTextarea");
const btnTodoAddTodo = document.getElementById("buttonAddTodo");
const btnTodoShowTasks = document.getElementById("buttonShowTasks");
const btnTodoHideTasks = document.getElementById("buttonHideTasks");

//FIXME: MOCK-DATA - xml => id, title, description, status, task
const mockXMLDataTodo = `<todos>
    <todo>
        <id>1</id>
        <title>todoTitle 1</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>3</status>
        <tasks>
            <task>1</task>
            <task>2</task>
            <task>5</task>
            <task>10</task>
            <task>11</task>
            <task>12</task>
        </tasks>
    </todo>
    <todo>
        <id>2</id>
        <title>todoTitle 2</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>1</status>
        <tasks>
            <task>3</task>
            <task>4</task>
        </tasks>
    </todo>
    <todo>
        <id>3</id>
        <title>todoTitle 3</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>5</status>
        <tasks>
            <task>6</task>
            <task>7</task>
            <task>8</task>
            <task>9</task>
        </tasks>
    </todo>
    <todo>
        <id>5</id>
        <title>todoTitle 5</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
            <task>13</task>
        </tasks>
    </todo>
        <todo>
        <id>10</id>
        <title>todoTitle 10</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
            <task>14</task>
            <task>15</task>
            <task>16</task>
            <task>17</task>
        </tasks>
    </todo>
        <todo>
        <id>21</id>
        <title>todo ohne task 21</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
        </tasks>
    </todo>
</todos>`;


document.addEventListener('DOMContentLoaded', todoPageLoaded);

function todoPageLoaded () {
    if (bodyTodoPage) {
        console.log("Todo page loading . . .")
        //TODO: click "Todo anlegen"
        btnTodoAddTodo.addEventListener("click", clickEventAcceptTodo);
        //TODO: click "+ Tasks"
        btnTodoShowTasks.addEventListener("click", todoDisplayToggleTasks);
        btnTodoHideTasks.addEventListener("click", todoDisplayToggleTasks);
        //TODO: click a task at todo page
        classContainerHiddenTasksContainedTasks.querySelector("p").addEventListener("click", todoOpenTask);

        statusPopupTodo.addEventListener("change", () => saveStatus(
            "todo",
            statusPopupTodo.options[statusPopupTodo.selectedIndex].value
        ));
    }
}

export async function callExistingTodo (inputTodo) {
    console.log("todo existiert bereits:" + JSON.stringify(inputTodo));
    await changePageToTodo();
    showExistingTodo(inputTodo);

}

export function showExistingTodo (inputTodo) {
    console.log("showExistingTodo work!" + JSON.stringify(inputTodo));
    //statusPopupTodo.options[statusPopupTodo.selectedIndex].value = inputTodo.status;
    console.log(todoTitleInput.value);
    console.log(todoDescriptionTextarea.value);

    todoTitleInput.value = inputTodo.title;
    todoDescriptionTextarea.value = inputTodo.description;
    return true;
}



/**
 * 1. spezielle showExistingTodo function aufrufen und todo als parameter übergeben
 */

function collectData() {
    let todoArray = xmlToArray(mockXMLDataTodo);

    const paragraphs = classContainerHiddenTasksContainedTasks.querySelectorAll("p");
    const dataIndices = [];

    //TODO: ist das sinnvoll? "neuer task erstellen" fragt id von db an und zeigt hier nur die ids an
    paragraphs.forEach(p => {
        const dataIndex = p.getAttribute("data-index");
        if (dataIndex) {
            dataIndices.push(parseInt(dataIndex, 10));
        }
    })

    const newTodoObj = {
        id: -1, //-1 => placeholder for new Todo, real ID given by DB
        title: todoTitleInput.value,
        description: todoDescriptionTextarea.value,
        status: statusPopupTodo.options[statusPopupTodo.selectedIndex].value,
        task: dataIndices
    }

    //TODO: mock data!
    todoArray.push(newTodoObj);

    console.log("New Todo: " + JSON.stringify(newTodoObj));
    console.log("todoArray: " + JSON.stringify(todoArray));

    return newTodoObj;
}

export function clickEventAcceptTodo() {
    //let test = collectData();
    todoTaskToXmlFormatter("todo", collectData());
    //forwardToOverview();
}

function todoOpenTask(event) {
    console.log("Task clicked: " + event.target.innerText);

    location.href = urlWebsiteRoot + "task.html"; //TODO: mock work-around! für prod einfügen: /?id=" + element.id;
}

function todoDisplayToggleTasks() {
    if (classContainerHiddenTasks.classList.contains('containerHiddenTasksHide')) {
        console.log("show tasks");
        classContainerHiddenTasks.classList.replace('containerHiddenTasksHide', 'containerHiddenTasksShow');
        btnTodoShowTasks.classList.replace('containerButtonShowTasksShow', 'containerButtonShowTasksHide');
    } else {
        console.log("hide tasks");
        classContainerHiddenTasks.classList.replace('containerHiddenTasksShow', 'containerHiddenTasksHide');
        btnTodoShowTasks.classList.replace('containerButtonShowTasksHide', 'containerButtonShowTasksShow');
    }
}

function todoTaskToXmlFormatter(todoOrTask, inputObj) {
    if (todoOrTask === "todo") {
        const xmlTodo = `
        <todo>
            <id>${inputObj.id}</id>
            <title>${inputObj.title}</title>
            <description>${inputObj.description}</description>
            <status>${inputObj.status}</status>
            <tasks>
                ${inputObj.task}
            </tasks>
        </todo>`;
        console.log(xmlTodo);
        return xmlTodo;
    } else if (todoOrTask === "task") {
        const xmlTask = `
        <task>
            <id>${inputObj.id}</id>
            <title>${inputObj.title}</title>
            <description>${inputObj.description}</description>
            <status>${inputObj.status}</status>
        </task>`;
        console.log("Task array -> task xml start . . .");
    } else {
        console.error("todo.js/arrayToXmlFormatter didnt get /todo nor /task as a first parameter . . .");
    }
}

