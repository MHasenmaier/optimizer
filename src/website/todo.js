const bodyTodoPage = document.getElementById("bodyTodoPage");

const classContainerHiddenTasksContainedTasks = document.querySelector(".containerHiddenTasksContainedTasks");
const classContainerHiddenTasks = document.querySelector(".containerHiddenTasks");
const statusPopupTodo = document.getElementById("statusPopupTodo");
const todoTitleInput = document.getElementById("todoTitleInput");
const todoDescriptionTextarea = document.getElementById("todoDescriptionTextarea")

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


//services

const parser = new DOMParser();
const urlToIndex = "http://localhost:8080/optimizer/src/backend/index.php/";
const urlWebsiteRoot = "http://localhost:8080/optimizer/src/website/";

//TODO: temporär globale variable
let maxTodos = 1;
let maxTasks = 1;


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
        console.error("script.js/arrayToXmlFormatter didnt get /todo nor /task as a first parameter . . .");
    }
}

/**
 *
 * @param xml
 * @returns {*[id, title, description, status, task: tasks]}
 */
function xmlToArray(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    const todos = xmlDoc.getElementsByTagName("todo");
    const result = [];

    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];
        const id = parseInt(todo.getElementsByTagName("id")[0].textContent);
        const title = todo.getElementsByTagName("title")[0].textContent;
        const description = todo.getElementsByTagName("description")[0].textContent;
        const status = parseInt(todo.getElementsByTagName("status")[0].textContent);
        const tasks = Array.from(todo.getElementsByTagName("task")).map(task => parseInt(task.textContent));

        result.push({id, title, description, status, task: tasks});
    }

    return result;
}


function forwardToOverview() {
    console.log("Open link to overview.html");

    location.href = urlWebsiteRoot + "overview.html";
}

//TODO: function für Statuscheck beim Bearbeiten eines Todos vorbereitet
function isStatusAllowed(todoOrTask, elementStatus) {
    const mockArray = xmlToArray(mockXMLDataTodo);
    let activeTodos = 0;

    for (const todo of mockArray) {
        if (todo.status === 4) {
            activeTodos++;
        }
    }

    if (todoOrTask === "todo" && elementStatus === "4") {
        if (maxTodos < activeTodos) {
            //TODO: return feedback to user as a popup/warning/etc
            console.log("Status is not allowed. Finish Todos (" + activeTodos + " active todos) or rise the focus limit (actual limit: " + maxTodos + " )");
            return false;
        }
    }
    return true;
}

function saveStatus(todoOrTask, elementStatus) {
    let statusValue = statusPopupTodo.options[statusPopupTodo.selectedIndex].value;
    console.log("Status is: " + statusValue);

    if (!isStatusAllowed(todoOrTask, elementStatus)) {
        return false;
    }
    //TODO: ändere den "status"-wert im array von diesem todo
    console.log("js/saveStatus set to: " + elementStatus);
}