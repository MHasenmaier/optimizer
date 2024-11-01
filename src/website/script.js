const parser = new DOMParser();
const contentOverview = document.getElementById("contentOverview");
const mainAddTodo = document.getElementById("mainAddTodo");

if (contentOverview) {
    loadTodosAsyncForOverview().then(clickTodoEvent);
}

if (mainAddTodo) {
    console.log(">Todo Main> startet . . .")
    //sendData();
}

// for page: overview
/**
 * loads all todos at overview.html
 * @returns Promise
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
async function clickTodoEvent() {

    //clickEvents funktionsnamen ändern - OK (clickTodoEvent)

    //ID des Buttons in variable speichern - OK (intSpecificID)

    //Daten der ID aus DB abrufen - OK

    //TODO: ASYNC Aufrufen der todo.html

    //TODO: Solange Promise unerfüllt ist - Ladescreen

    //TODO: Wenn Promise erfüllt ist, Daten des Promise in Seite anzeigen

    console.log("start: clickTodoEvent");
    const arrAllTodoButtons = document.querySelectorAll('.todoButton');

    let intSpecificID = -1; //default value
    //let todoPage = false;

    arrAllTodoButtons.forEach(button => {
        button.addEventListener('click', async () => {
            //get ID of the todo (parent div of the button)
            intSpecificID = event.target.parentElement.id;

            //check if catch-ID worked
            if (intSpecificID > 0) {
                //get the todo from DB
                try {
                    const response = await fetch(`http://localhost/optimizer/src/backend/index.php/todo/?id=${intSpecificID}`, {
                        mode: "cors",
                    });
                    const body = await response.text();
                    const xmlTodo = await parser.parseFromString(body, "text/xml");
                    await console.log('Todo async loaded\nXML formatted: \n', xmlTodo, '\n');

                    //TODO: await for promise, DB info
                    //async switch to todo.html
                    switchToTodoHTML();

                    //TODO: wait for promise, DB info  - TODO: wait for page has loaded successfully
                    //write todo info in the input and text-area at the todo page - if page is loaded and DB has responded
                    renderTodoInAddTodo(xmlTodo);



                    return xmlTodo;
                } catch (err) {
                    console.log("frontend error in getSpecificTodo:\n" , err , "\n");
                }
            }


        })


        //renderTodoInAddTodo()

    });

}

/**
 * create the imaginary elements for a todo in AddTodo
 * @param xmlInput
 */
function renderTodoInAddTodo(xmlInput) {
    const id = xmlInput.getElementsByTagName("ID")[0].textContent;
    let title = xmlInput.getElementsByTagName("title")[0].textContent;
    let status = xmlInput.getElementsByTagName("status")[0].textContent;
    let description = xmlInput.getElementsByTagName("description")[0].textContent;

    console.log(`id = ${id}\ntitle = ${title}\nstatus = ${status}\ndescription:\n${description}\n`);



    //TODO: type-error (.innerHTML)
    let titelAtPage = document.getElementById("todoTitle").innerHTML;

    //let descriptionAtPage = document.getElementById("todoDescription").innerHTML;

    console.log(`TodoTitel = ${titelAtPage}`);

    //document.getElementById("todoTitle").innerText = xmlInput.getElementsByTagName("title")[0].textContent;
    //document.getElementById("todoDescription").innerText = xmlInput.getElementsByTagName("description")[0].textContent;


}

/**
 * switch to the (Add-New-)To-do-Page
 * @returns {string}
 */
function switchToTodoHTML() {
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