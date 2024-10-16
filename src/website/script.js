const parser = new DOMParser();
const contentOverview = document.getElementById("contentOverview");
const mainAddTodo = document.getElementById("mainAddTodo");

if (contentOverview) {
    loadTodosAsyncForOverview().then(clickEvents);
}

if (mainAddTodo) {
    console.log(">Todo Main> startet . . .")
    //sendData();
}

// for page: overview
/**
 * loads all todos at overview.html
 * @returns {Promise<boolean>}
 */
async function loadTodosAsyncForOverview() {
    try {
        const response = await fetch("http://localhost/optimizer/src/backend/index.php/activetodos", {
            mode: "cors",
        });
        const body = await response.text();
        // console.log("body", body); // debugging

        const xmlObject = parser.parseFromString(body, "text/xml");
        console.log('Todos async loaded\nXML formatted: \n', xmlObject, '\n');

        createTodoElements(xmlObject);
        return true;

    } catch (err) {
        console.error("Frontend error in loadTodosAsyncForOverviews(): \n", err);
    }
}

/**
 * create the to-do boxes for each to-do inside the XML
 * @param xmlObject - xml formatted
 */
function createTodoElements(xmlObject) {

    //Fetch all <todo> elements from XML
    const todos = xmlObject.getElementsByTagName("todo");

    // Loop through each <todo>
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];

        // Extract the relevant data
        const id = todo.getElementsByTagName("ID")[0].textContent;
        const title = todo.getElementsByTagName("title")[0].textContent;
        //let status = to-do.getElementsByTagName("status")[0].textContent;

        // Create the div for the todo
        const todoDiv = document.createElement("div");
        todoDiv.setAttribute("id", id);
        todoDiv.setAttribute("class", "todoCountClass");

        //Set the title of the todo
        const todoTitle = document.createElement("button");
        todoTitle.setAttribute("class", "todoButton");
        todoTitle.innerHTML = title;

        //TODO path isnt working!! see also routing.php (51)
        todoTitle.setAttribute("href", "http://localhost/optimizer/src/backend/index.php/todo/?id=" + id);

        // Create a new input checkbox element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        //Task box
        const taskBox = document.createElement("button");
        taskBox.setAttribute("class", "taskButton");


        // Display the checkbox only if taskId is not 0
        //if (taskId !== "") {
            // TODO: box einblenden mit ANZAHL angehängter tasks
        //}

        // Append the newly created div to an existing container on your page
        contentOverview.appendChild(todoDiv);

        //order of the includes is important
        todoDiv.appendChild(checkbox);
        todoDiv.appendChild(todoTitle);
        todoDiv.appendChild(taskBox);
    }
}

/**
 * handles the clickevents triggered by buttons at overview-page
 */
function clickEvents() {

    // ID des Buttons in variable speichern

    //Daten der ID aus DB abrufen

    //ASYNC Aufrufen der todo.html

    //Solange Promise unerfüllt ist - Ladescreen

    //Wenn Promise erfüllt ist, Daten des Promise in Seite anzeigen

    console.log("clickEvents available: . . .");
    const allTodoButtons = document.querySelectorAll('.todoButton');

    let specificID = -1; //default value


    for (let i = 0; i < allTodoButtons.length; i++) {       // browse through all buttons
        allTodoButtons[i].addEventListener('click', async function () {  // click event for all buttons
            specificID = this.parentElement.id;        // catch id of the clicked to-do  //alternate to "this" -> "allTodoButtons[i]"
            if (specificID !== -1) {                                // check if there really was click and the ID has been catched

                try {
                    const fetchedXML = await getSpecificTodo(specificID);     // get the specific to-do
                    console.log(`fetched xml = ${fetchedXML}`);             // log specific to-do
                    switchToTodoPage();
                    renderTodoInAddTodo(fetchedXML);
                } catch (error) {
                    console.error(`frontend error in clickevents: ${error}`);
                }
                console.log(`specID: ${specificID}`);
            }
        })
    }
    console.log("--- clickEvent finished ---");
}

/**
 * create the imaginary elements for a todo in AddTodo
 * @param input
 */
function renderTodoInAddTodo(input) {
    console.log(`renderTodo input (XML) = ${input}`);

    //TODO: XML bleibt XML - kein to-string parsen
    const inputXML = parseXMLString(input);
    console.log(`parsed inputXML = ${inputXML}`);

    if (inputXML instanceof XMLDocument) {
        console.log("inputXML is valid");
    } else {
        console.error("inputXML is not valid.");
        return;
    }

    const rootNode = inputXML.documentElement;
    console.log(`renderTodo rootNode.nodeName = ${rootNode.nodeName}`);

    const children = rootNode.childNodes;
    for (let i = 0; i < children.length; i++) {
        //const grandChildNodes = children.childNodes;

        const todoElements = children[i];
        console.log(`todoElement = ${i}`, todoElements.nodeName);

    }

    console.log(new XMLSerializer().serializeToString(rootNode));

    const todos = rootNode.querySelectorAll("todos");
    todos.forEach((todo, index) => {
        const title = todo.querySelector("title").textContent;
        const status = todo.querySelector("status").textContent;
        const description = todo.querySelector("description").textContent;

        console.log(`todo index: = ${index + 1}`);
        console.log(`todo title: = ${title}`);
        console.log(`todo status: = ${status}`);
        console.log(`todo description: = ${description}`);
    })
}

/**
 *
 * @param id
 * @returns {Promise<Document>}
 */
async function getSpecificTodo(id) {
    try {
        const response = await fetch(`http://localhost/optimizer/src/backend/index.php/todo/?id=${id}`, {
            mode: "cors",
        });
        const body = await response.text();
        return await parser.parseFromString(body, "text/xml");  //returns the specific to-do from DB
    } catch (err) {
        console.log("frontend error in getSpecificTodo: \n", err);
    }
}

/**
 * switch to the (Add-New-)To-do-Page
 * @returns {string}
 */
function switchToTodoPage() {
    return window.location.href = "http://localhost/optimizer/src/website/todo.html";
}

/**
 *
 * @param inputString (String)
 * @returns Document {XMLDocument}
 */
function parseXMLString(inputString) {
    const parser = new DOMParser();
    return parser.parseFromString(inputString.trim, "application/xml");
}

// for page: todo
function sendData() {
    const buttonAddTodo = document.getElementById("buttonAddTodo");

    const statusPopup = document.getElementById("statusPopup");
    const todoTitle = document.getElementById("todoTitle");
    const todoDescription = document.getElementById("todoDescription");

    const todoElement = document.createElement("todo");
    const todoID = document.createElement("ID");
    const title = document.createElement("title");
    const status = document.createElement("status");
    const description = document.createElement("description");

    todoElement.appendChild(todoID);
    todoElement.appendChild(title);
    todoElement.appendChild(status);
    todoElement.appendChild(description);

    buttonAddTodo.addEventListener("click", async function createTodoElement() {

        let todoStatus = statusPopup.options[statusPopup.selectedIndex].value;

        todoID.innerText = "9";
        title.innerText = todoTitle.value;
        status.innerText = todoStatus;
        description.innerText = todoDescription.value;

        //console.log(todoElement);

        const url = "http://localhost/optimizer/src/backend/index.php/todo";
        //const urlA = "http://localhost:63342/optimizer/src/website/createTodo.html?_ijt=n56q2cvh6ssai843ca0hrav1au&_ij_reload=RELOAD_ON_SAVE";

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
            },
            body: todoElement
            //    body: JSON.stringify({
            //        id: todoID.innerText,
            //        title: todoTitle.value,
            //        description: todoDescription.value,
            //        status: todoStatus.value
            //        }
            //    ),
        })
            .then((response) => console.log(response))
            .then(() => console.log(todoElement))
    });
}



