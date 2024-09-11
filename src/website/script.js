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
        const response = await fetch("http://localhost/optimizer/src/backend/index.php/activetodos", {
            mode: "cors",
        });
        const body = await response.text();
        // console.log("body", body); // debugging

        const xmlObject = parser.parseFromString(body, "text/xml");
        console.log('XML Test: loadTododsAsync \n', xmlObject, '\n');

        renderTodos(xmlObject);

        return true;

    } catch (err) {
        console.error("Frontendfehler in loadTodosAsync(): \n", err);
    }
}

function renderTodos(xmlObject) {

    // Get all <todo> elements
    const todos = xmlObject.getElementsByTagName("todo");

    // Loop through each <todo> element
    for (let i = 0; i < todos.length; i++) {
        const todo = todos[i];

        // Extract the relevant data
        const id = todo.getElementsByTagName("ID")[0].textContent;
        const title = todo.getElementsByTagName("title")[0].textContent;
        const taskId = todo.getElementsByTagName("taskId")[0].textContent;

        // Create a new div element for the todo
        const todoDiv = document.createElement("div");
        todoDiv.setAttribute("id", id);
        todoDiv.innerHTML = title;

        // Create a new input checkbox element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        // Display the checkbox only if taskId is not 0
        if (taskId !== "") {
            checkbox.checked = true;
            todoDiv.appendChild(checkbox);
        }

        // Append the newly created div to an existing container on your page
        contentOverview.appendChild(todoDiv);
    }
}

function loadTodos() {
    //console.log("load todos")

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

console.log("XML Test: ", loadTodos() , "\n");


async function loadTododsAsync() {
    try {
        const response = await fetch("http://localhost/optimizer/src/backend/index.php/activetodos")
        const body = await response.text()
        console.log("body", body)

        const xmlObject = parser.parseFromString(body, "text/xml")
        console.log("xml", xmlObject)

    } catch (err) {
        console.error("Ein fehler ist aufgetreten", err);
    }
}

/** GPT analyse - löschen, wenn code angepasst wurde
 * // Beispiel: Dynamisches Hinzufügen von Elementen
 * const container = document.getElementById('container');
 *
 * for (let i = 0; i < 5; i++) {
 *   const newElement = document.createElement('div');
 *   newElement.innerHTML = `<span data-status="${i}">Status: ${i}</span>`;
 *   container.appendChild(newElement);
 * }
 *
 * // Ansprechen der dynamisch erstellten Elemente
 * const elements = container.querySelectorAll('div > span[data-status]');
 *
 * elements.forEach(element => {
 *   const statusValue = parseInt(element.getAttribute('data-status'));
 *   console.log('Status:', statusValue);
 * });
 *
 */


/**
 *
 * @param inputPromObj
 */
//function createTodoElements(inputPromObj) {
//
//    const todoid = 0;
//    const todoArray = inputPromObj.getElementsByTagName("todo");
//
//    for (let i = 0; i < todoArray.length; i++) {
//        //create TodoBox
//        const todoBox = document.createElement("div");
//        const checkbox = document.createElement("input");
//        checkbox.setAttribute("id", todoArray[i].children[todoid].innerHTML);
//        todoBox.appendChild(checkbox);
//
//        //checkbox.checked = parseInt(todoArray[i].children[status].innerHTML) === 4;
//        if (parseInt(todoArray[i].children[input].innerHTML) === 4) {
//            checkbox.checked = true;
//        } else {
//            if (taskidInnerHtml.length > 0 && taskidInnerHtml.at(0) !== "") {
//                console.log(taskidInnerHtml.at(1));
//                const button = document.createElement("button");
//                button.textContent = (toString(taskidInnerHtml.length));
//                todoBox.appendChild(button);
//            }
//
//        }
//    }
//}


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