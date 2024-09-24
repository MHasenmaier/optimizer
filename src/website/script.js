const parser = new DOMParser();
const contentOverview = document.getElementById("contentOverview");
const mainAddTodo = document.getElementById("mainAddTodo");


if (contentOverview) {
    loadTodosAsyncForOverview();
}

if (mainAddTodo) {
    const currentUrl = document.URL;
    console.log(currentUrl);
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
        console.log('Todos loaded - async and XML formatted: \n', xmlObject, '\n');

        renderTodos(xmlObject);

        return true;

    } catch (err) {
        console.error("Frontendfehler in loadTodosAsync(): \n", err);
    }
}

/**
 * create the to-do boxes for each to-do inside the XML
 * @param xmlObject - xml formatted
 */
function renderTodos(xmlObject) {

    //Fetch all <todo> elements from XML
    const todos = xmlObject.getElementsByTagName("todo");

    // Loop through each <todo>
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];

        // Extract the relevant data
        const id = todo.getElementsByTagName("ID")[0].textContent;
        const title = todo.getElementsByTagName("title")[0].textContent;
        const taskId = todo.getElementsByTagName("taskId")[0].textContent;
        let status = todo.getElementsByTagName("status")[0].textContent;

        // Create the div for the todo
        const todoDiv = document.createElement("div");
        todoDiv.setAttribute("id", id);

        //Set the title of the todo
        const todoTitle = document.createElement("a");
        todoTitle.innerHTML = title;

        //TODO path isnt working!! see also routing.php (51)
        todoTitle.setAttribute("href", "http://localhost/optimizer/src/backend/index.php/?id=" + id);

        // Create a new input checkbox element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        //Task box
        const taskBox = document.createElement("button");
        taskBox.setAttribute("id", "taskOf" + id);


        // Display the checkbox only if taskId is not 0
        if (taskId !== "") {
            // TODO: box einblenden mit anzahl angehöngter tasks
            taskBox.innerText = taskId;
        }

        // Append the newly created div to an existing container on your page
        contentOverview.appendChild(todoDiv);

        //order of the includes is important
        todoDiv.appendChild(checkbox);
        todoDiv.appendChild(todoTitle);
        todoDiv.appendChild(taskBox);
    }
}

//useless function?
function loadTodos() {
    //console.log("load todos");
    const responePromise = fetch("http://localhost/optimizer/src/backend/index.php/activetodos")
        .then((response) => {

            if (!response.ok) throw new Error("Unsatisfying response code " + response.statusText);

            return response.text()
        })
        .then(body => {
            //console.log("body", body);

            const xmlObject = parser.parseFromString(body, "text/xml");

            //extract all stuff from the todo
            const id = xmlObject.getElementsByTagName("id");
            const taskid = xmlObject.getElementsByTagName("taskid");
            const title = xmlObject.getElementsByTagName("title");
            const status = xmlObject.getElementsByTagName("status");
            const description = xmlObject.getElementsByTagName("description");
            const createDate = xmlObject.getElementsByTagName("createDate");
            const updateDate = xmlObject.getElementsByTagName("updateDate");
            const lastUpdate = xmlObject.getElementsByTagName("lastUpdate");

            //console.log("Fetch successfully",
            //    {
            //        id: id,
            //        taskid: taskid,
            //        title: title,
            //        status: status,
            //        description: description,
            //        createDate: createDate,
            //        updateDate: updateDate,
            //        lastUpdate: lastUpdate,
            //    })

            return xmlObject;

        })
        .catch((err) => {
            console.error("Ein Fehler in loadTodos() ist aufgetreten", err);
            return false;
        })
}

// for page: createTodo
function sendData() {
    const buttonAddTodo = document.getElementById("buttonAddTodo");

    const statusPopup = document.getElementById("statusPopup");
    const todoTitle = document.getElementById("todoTitle");
    const todoDescription = document.getElementById("todoDescription");

    const todoElement = document.createElement("todo");
    const todoID = document.createElement("ID");
    const taskID = document.createElement("taskID");
    const title = document.createElement("title");
    const status = document.createElement("status");
    const description = document.createElement("description");

    todoElement.appendChild(todoID);
    todoElement.appendChild(taskID);
    todoElement.appendChild(title);
    todoElement.appendChild(status);
    todoElement.appendChild(description);

    buttonAddTodo.addEventListener("click", async function createTodoElement() {

        let todoStatus = statusPopup.options[statusPopup.selectedIndex].value;

        todoID.innerText = "9";
        taskID.innerText = "[1, 2, 3, 4, 5, 6, 7]";
        title.innerText = todoTitle.value;
        status.innerText = todoStatus;
        description.innerText = todoDescription.value;

        //console.log(todoElement);

        const url = "http://localhost/optimizer/src/backend/index.php/todo";
        const urlA = "http://localhost:63342/optimizer/src/website/createTodo.html?_ijt=n56q2cvh6ssai843ca0hrav1au&_ij_reload=RELOAD_ON_SAVE";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/xml",
            },
            body: todoElement
            //    body: JSON.stringify({
            //        id: todoID.innerText,
            //        title: todoTitle.value,
            //        taskID: todoID.innerText,
            //        description: todoDescription.value,
            //        status: todoStatus.value
            //        }
            //    ),
        })
            .then((response) => console.log(response))
            .then(() => console.log(todoElement))
    });
}

// for page: createTodo
//to read the data from the todoAddForms
//async function collectTodo() {
//    const formData = new FormData(todoAddForms);
//    console.log("formData erstellt")
//
//    const data = {
//        title: formData.get("todoTitle"),
//        description: formData.get("todoDescription"),
//        status: formData.get("todoStatus")
//    };
//    console.log("data enthält: " + data);
//
//    try {
//        const response = await fetch("http://localhost:63342/optimizer/src/website/createTodo.html?_ijt=kmuqi4h9vna9b0rbplkjndobnk&_ij_reload=RELOAD_ON_SAVE", {
//            method: "POST",
//            headers: {
//                "Content-Type": "application/json",
//            },
//            body: JSON.stringify(data),
//        });
//        console.log("response enthält: " + response);
//
//        if (!response.ok) {
//            throw new Error("Something went wrong");
//        }
//        const result = await response.json();
//        console.log(result);
//    } catch (e) {
//        console.error(e);
//    }
//}