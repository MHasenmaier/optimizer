const parser = new DOMParser();
const contentOverview = document.getElementById("contentOverview");
const mainAddTodo = document.getElementById("mainAddTodo");

if (contentOverview) {
    loadTodosAsync();
}

if (mainAddTodo) {
    sendData();
}

// for page: overview
async function loadTodosAsync() {
    try {
        const response = await fetch("http://localhost/optimizer/src/backend/index.php/activetodos");
        const body = await response.text();
        console.log("body", body)

        const xmlObject = parser.parseFromString(body, "text/xml");
        console.log('XML Test: loadTododsAsync \n', xmlObject, '\n');

        createTodoElements(xmlObject);

        //return await xmlObject;

    } catch (err) {
        console.error("Frontendfehler in loadTodosAsync(): \n", err);
    }
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

    buttonAddTodo.addEventListener("click", async function createTodoElement () {

        let todoStatus = statusPopup.options[statusPopup.selectedIndex].value;

        todoID.innerText = "9";
        taskID.innerText = "[1, 2, 3, 4, 5, 6, 7]";
        title.innerText = todoTitle.value;
        status.innerText = todoStatus;
        description.innerText = todoDescription.value;

        console.log(todoElement);

        const url = "http://localhost/optimizer/src/backend/index.php/todo";

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(todoElement),
        })
            .then((response) => console.log(todoElement))
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