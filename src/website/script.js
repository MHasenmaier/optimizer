const parser = new DOMParser();
const urlToIndex = "http://localhost:8080/optimizer/src/backend/index.php/";
const urlWebsiteRoot = "http://localhost:8080/optimizer/src/website/";

const bodyOverview = document.getElementById("bodyOverview");
const classContentOverview = document.querySelector('.contentOverview');
const footerOverviewAddTodoButton = document.getElementById('footerOverviewAddTodoButton');
const headerOverviewDisplayPopupMenuButton = document.getElementById("menuButton");
const classHeaderOverviewPopupMenuWindow = document.querySelector(".popupMenuWindow");
const headerOverviewFocusButton = document.getElementById('headerOverviewFocusButton');
const headerOverviewArchivButton = document.getElementById('headerOverviewArchivButton');

const bodyTodoPage = document.getElementById("bodyTodoPage");
const btnTodoAddTodo = document.getElementById("buttonAddTodo");
const btnTodoShowTasks = document.getElementById("buttonShowTasks");
const btnTodoHideTasks = document.getElementById("buttonHideTasks");
const classContainerHiddenTasks = document.querySelector(".containerHiddenTasks");


const bodyLandingPage = document.getElementById("bodyLanding");
const btnLanding = document.getElementById("buttonLanding");
const btnLandingImg = document.getElementById("imageLanding");

const bodyTask = document.getElementById("taskBody");

const bodyDeleted = document.getElementById("deletedBody");

const bodyArchiv = document.getElementById("doneBody");

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

//FIXME: MOCK-DATA - xml => id, title, description, status, task
const mockXMLData = `<todos>
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

// starts with all html pages
document.addEventListener('DOMContentLoaded', domContentLoaded);

//to manage to button click events
function domContentLoaded() {

    //landing.html
    if (bodyLandingPage) {
        btnLanding.addEventListener("click", landingStartApp);
        btnLandingImg.addEventListener("click", landingStartApp);
    }

    //overview.html
    if (bodyOverview) {
        console.log("Overview loading. . .");
        createTodoOverview(xmlToArray(mockXMLData));    //TODO: mocked data
        console.log(xmlToArray(mockXMLData));

        classContentOverview.addEventListener('click', overviewTodoClick);
        classContentOverview.addEventListener('change', overviewCheckboxClick);
        footerOverviewAddTodoButton.addEventListener('click', overviewAddNewTodo);  //TODO: better function name
        headerOverviewFocusButton.addEventListener('click', overviewLinkOpenFocus);
        headerOverviewArchivButton.addEventListener('click', overviewLinkOpenArchiv);
        headerOverviewDisplayPopupMenuButton.addEventListener("click", overviewPopupMenuWindowControl);
        //FIXME: bug! bei klick wird das fenster nicht zuverlässig geöffnet/geschlossen
        headerOverviewDisplayPopupMenuButton.querySelector("span").addEventListener("click", overviewPopupMenuWindowControl);
    }

    //todo.html
    if (bodyTodoPage) {
        console.log("Todo page loading . . .")
        //TODO: click "Todo anlegen"
        btnTodoAddTodo.addEventListener("click", forwardToOverview);
        //TODO: click "+ Tasks"
        btnTodoShowTasks.addEventListener("click", todoShowTasks);
        btnTodoHideTasks.addEventListener("click", todoHideTasks);
        //TODO: click a task at todo page
        classContainerHiddenTasks.querySelector("div").addEventListener("click", todoOpenTask);


    }

    //task.html
    if (bodyTask) {
        console.log("Task page loading . . .")
    }

    //archiv.html
    if (bodyArchiv) {
        console.log("Archiv loading . . .");
        //TODO: button anpassen
        btnFocusBack.addEventListener("click", forwardToOverview);
    }

    //deleted.html
    if (bodyDeleted) {
        console.log("Deleted page loading . . .");
        //TODO: button anpassen
        btnFocusBack.addEventListener("click", forwardToOverview);
    }

    //focus.html
    if (bodyFocus) {
        console.log("Focus page loading . . .");
        //TODO: todo & task generisch zusammenfassen
        slideTodoFocus.addEventListener("change", () => focusSetDisplayOfPopup("todo"));
        slideTaskFocus.addEventListener("change", () => focusSetDisplayOfPopup("task"));
        //TODO: "Save"
        //TODO: todo & task generisch zusammenfassen
        inputFocusMaxTodos.addEventListener("input", () => setFocus("todo"));
        inputFocusMaxTasks.addEventListener("input", () => setFocus("task"));
        btnFocusBack.addEventListener("click", forwardToOverview);
    }
}

/**
 * Click events
 * TODO: include return values (true/false?) for all event functions
 */

function overviewAddNewTodo() {
    console.log("New Todo will be created... soon.");

    location.href = urlWebsiteRoot + "todo.html";
}

function forwardToOverview() {
    console.log("Open link to overview.html");

    location.href = urlWebsiteRoot + "overview.html";
}

function todoShowTasks() {
    console.log("Show Tasks");
    classContainerHiddenTasks.style.display = "flex";
    btnTodoShowTasks.style.display = "none";
}

function todoOpenTask(event) {
    console.log("Task clicked: " + event.target.innerText);

    location.href = urlWebsiteRoot + "task.html"; //TODO: work-around entfernen /?id=" + element.id;
}

function todoHideTasks() {
    console.log("Hide Tasks");
    classContainerHiddenTasks.style.display = "none";
    btnTodoShowTasks.style.display = "flex";
}

/**
 * Function for the event if the checkbox (overview.html) is checked/unchecked
 * @param event (click event)
 */
function overviewCheckboxClick(event) {
    if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {  //change on checkbox
        //TODO: debugging output
        console.log("Checkbox checked: ", event.target.parentElement.parentElement.querySelector('p').innerText);

        // Ausgabe des Inhalts des Paragraphs
        const parentDiv = event.target.parentElement.closest('div');
        console.log("Parent div found:", parentDiv);
        const paragraph = parentDiv ? parentDiv.querySelector('p') : null;
        console.log("Paragraph element:", paragraph);
        if (paragraph) {
            console.log("Paragraph Content:", paragraph.innerText);
        } else {
            console.log("No paragraph found.");
        }
    }
}

/**
 * Function for the event if the title of a todo (overview.html) is clicked
 * @param event (click event)
 */
function overviewTodoClick(event) {
    if (event.target.tagName === 'P') {  //click todo
        //FIXME: mock output for debugging
        console.log("Paragraph clicked:", event.target.innerText);
        const index = event.target.getAttribute("data-index");
        const element = xmlToArray(mockXMLData)[index];
        //TODO: include DB content
        //FIXME: at fetchDBTodo() function
        const dbTodo = fetchDBTodo(index);
        console.log(element);
        console.log("from DB:\n" + dbTodo);
        //open link todo page

        //id of requested todo in URL
        //TODO: informationsübertrag funktioniert noch nicht korrekt
        //TODO: 1. index.php öffnen -> 2. php öffnet todo-html
        location.href = urlWebsiteRoot + "todo.html"; //TODO: work-around entfernen /?id=" + element.id;
    }
}

function overviewPopupMenuWindowControl() {
    if (classHeaderOverviewPopupMenuWindow.classList.contains('popupMenuWindowHide')) {
        console.log("show popup menu");
        classHeaderOverviewPopupMenuWindow.classList.replace('popupMenuWindowHide', 'popupMenuWindowShow');
    } else {
        console.log("hide popup menu");
        classHeaderOverviewPopupMenuWindow.classList.replace('popupMenuWindowShow', 'popupMenuWindowHide');
    }
}

function overviewLinkOpenArchiv() {
    console.log("Archiv will be opened ... soon");

    location.href = urlWebsiteRoot + "archiv.html";
}

function overviewLinkOpenFocus() {
    console.log("Focus mode will be opened ... soon");

    location.href = urlWebsiteRoot + "focus.html";
}

//TODO: mocked function
function landingStartApp(event) {
    console.log("Change page to overview.html" + event);

    //TODO: install function to check existence of DB and tables, return true/false
    const checkedDB = checkDB();
    const checkedDBTables = checkDBTables();

    if (!checkedDB) {
        console.log("DB will be set up ... soon");
        if (!setupNewDB()) {
            console.error("DB couldn't set up\nCheck DB!");
        }
    }

    if (!checkedDBTables) {
        console.log("Tables will be set up ... soon")
        if (!setupDBTables()) {
            console.error("DB Tables couldn't set up!\nCheck DB!");
        }
    }

    location.href = urlWebsiteRoot + "overview.html";
}

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

//TODO: function für Statuscheck beim Bearbeiten eines Todos vorbereitet
function isStatusAllowed(todoOrTask, elementStatus) {
    const activeTodos = countActiveTodos();

    if (maxTodos < activeTodos) {
        console.log("Status is not allowed. Finish Todos or rise the focus limit");
        return false;
    }
    return true;
}

function countActiveTodos() {
    const mockArray = xmlToArray(mockXMLData);
    let activeTodos = 0;
    for (const todo of mockArray) {
        if (todo.status === 4) {
            activeTodos++;
        }
    }
    return activeTodos;
}

/**
 * DB and table status functions
 */

/**
 * checks if a DB exists
 * @returns {boolean}
 */
function checkDB() {
    console.log("DB will be checked ... soon");
    //TODO: install DB call to check if DB is accessible
    const dbState = true;
    console.log("Status DB is: " + dbState);
    return dbState;
}

/**
 * set DB up if none is found
 * @returns {true}
 */
function setupNewDB() {
    console.log("DB and tables will be ready for business ... soon");
    //TODO: contact URL for set up a new DB
    return true;
}

function checkDBTables() {
    console.log("Tables will be checked ... soon");
    //TODO: install DB call to check if the tables are accessible
    const tableState = true;
    console.log("Status Tables is: " + tableState);
    return tableState;
}

function setupDBTables() {
    console.log("Tables of the DB will be ready for business ... soon");
    //TODO: SQL line to set up tables in the DB
    return true;
}

/**
 * set up the html files with content from the DB
 */

//TODO: how to debug, if the function fails? return false?
/**
 * create html elements and provide information
 * @param todoData
 * return true if successful
 */
function createTodoOverview(todoData) {
    const contentOverview = document.querySelector(".contentOverview");
    contentOverview.innerHTML = "";

    todoData.forEach((todo, arrayIndex) => {
        const div = document.createElement("div");
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        const paragraph = document.createElement("p");
        paragraph.setAttribute("data-index", arrayIndex);
        const button = document.createElement("button");

        contentOverview.appendChild(div);
        div.appendChild(label);
        div.appendChild(paragraph);
        div.appendChild(button);
        label.appendChild(input);

        if (todo.status === 5) {
            input.checked = true;
        }

        paragraph.innerText = todo.title;
        button.innerText = todo.task.length.toString();
    });

    return true;
}

//TODO: still relevant?
/**
 * loads all todos at overview.html
 * @returns Promise
 */
async function loadTodosAsyncForOverview() {
    try {
        const response = await fetch(urlToIndex + 'activetodos', {
            mode: "cors",
        });
        const body = await response.text();
        console.log("body", body); // debugging

        const xmlObject = parser.parseFromString(body, "text/xml");
        console.log('Todos async loaded\nXML formatted: \n', xmlObject, '\n');

        createTodoElements(xmlObject);
        return true;

    } catch (err) {
        console.error("Frontend error in loadTodosAsyncForOverviews(): \n", err);
    }
}


/**
 * support functions
 */

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


/**
 * necessitate of function unknown
 */

//TODO: check DB connection / valid DB data return
/**
 * take the provided ID and fetch the todo data of it from the DB
 * returns the XML formatted todo data if promise is fulfilled
 * @param inputSpecificID
 * @returns {Promise<Document>}
 */
async function fetchDBTodo(inputSpecificID) {
    console.log(`function fetchDBTodo started with element #${inputSpecificID} . . .`);
    const parser = new DOMParser();
    //to prevent invalid IDs
    if (inputSpecificID > 0) {
        try {
            const response = await fetch(urlToIndex + `todo/?id=${inputSpecificID}`, {
                mode: "cors",
                method: 'GET'
            });
            const body = await response.text();
            await console.log(`body: ${body}`);

            const xmlTodo = await parser.parseFromString(body, "text/xml");
            await console.log('Todo async loaded\nXML formatted (xmlTodo loaded): \n', xmlTodo, '\n');

            console.log(`function fetchDBTodo: xmlTodo = ${xmlTodo}`);
            return xmlTodo;
        } catch (err) {
            console.log("frontend error in getSpecificTodo:\n", err, "\n");
        }
    }
}

//TODO: rework function
/**
 * create the imaginary elements for a todo in AddTodo
 * @param xmlInput
 */
function renderTodoInAddTodo(xmlInput) {
    const givenTodoTitle = document.getElementById("todoPageTodoTitle");
    const id = xmlInput.getElementsByTagName("ID")[0].textContent;
    let title = xmlInput.getElementsByTagName("title")[0].textContent;
    let status = xmlInput.getElementsByTagName("status")[0].textContent;
    let description = xmlInput.getElementsByTagName("description")[0].textContent;

    console.log(`id = ${id}\ntitle = ${title}\nstatus = ${status}\ndescription:\n${description}\n`);

    givenTodoTitle.value = title;


    //let descriptionAtPage = document.getElementById("todoDescription").innerHTML;

    //console.log(`todoPageTodoTitle = ${titelAtPage}`);

    //document.getElementById("todoTitle").innerText = xmlInput.getElementsByTagName("title")[0].textContent;
    //document.getElementById("todoDescription").innerText = xmlInput.getElementsByTagName("description")[0].textContent;
}