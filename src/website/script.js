const parser = new DOMParser();
const buttonAddTodo = document.getElementById("buttonAddTodo");
const todoAddForms = document.getElementById("todoAddForms");
const contentOverview = document.getElementById("contentOverview");

if (contentOverview) {
    loadTodosAsync();
}

//todoAddForms.addEventListener("submit", event => {
//    //no page refresh after submitting
//    //event.preventDefault();
//    collectTodo();
//})
//
////to read the data from the todoAddForms
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

//    // run the function just if the button is loaded
//    if (buttonAddTodo) {
//        buttonAddTodo.addEventListener("click", () => {
//                //sendData()
//                const todoTitleInput = document.getElementById("todoTitle").value;
//                const todoDescriptionInput = document.getElementById("todoDescription").value;
//                const todoStatusPopup = document.getElementById("statusPopup").value;
//
//
//                let todoData = {};
//
//                todoData.title = todoTitleInput;
//                todoData.description = todoDescriptionInput;
//                todoData.status = todoStatusPopup;
//
//                console.log(todoData);
//
//
//                console.log('<todo>' +
//                    '   <ID>5</ID>' +
//                    '   <taskID>1,3,5,7</taskID>' +
//                    '   <title>' + todoTitleInput + '</title>' +
//                    '   <status>' + todoStatusPopup + '</status>' +
//                    '   <description>' + todoDescriptionInput + '</description>' +
//                    '</todo>');
//
//                return true;
//            }
//        )
//    }


/*
<div id="36">
    <input type="checkbox"/>
    <a href="xyz/usw/id=12">Todo title 1 </a>
    <button>01</button>
</div>
*/


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


function createTodoElements(inputPromObj) {

    const todoid = 0;
    const taskid = 1;
    const title = 2;
    const status = 3;
    //const description = 4;
    //const createDate = 5;
    //const updateDate = 6;
    //const lastUpdate = 7;

    const todoArray = inputPromObj.getElementsByTagName("todo");

    for (let i = 0; i < todoArray.length; i++) {
        //create TodoBox
        const todoBox = document.createElement("div");
        contentOverview.appendChild(todoBox);

        //create checkbox-field
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.setAttribute("id", todoArray[i].children[todoid].innerHTML);
        todoBox.appendChild(checkbox);

        //checkbox.checked = parseInt(todoArray[i].children[status].innerHTML) === 4;
        if (parseInt(todoArray[i].children[status].innerHTML) === 4) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }

        //create <a>-tag
        const todoTitleLink = document.createElement("a");
        todoTitleLink.innerHTML = todoArray[i].children[title].innerHTML;
        todoBox.appendChild(todoTitleLink);

        //create task-button
        let abc = todoArray[i].children[taskid].innerHTML; // [ = 1. elem, .... ] = last elem.
        let taskidInnerHtml = abc.substring(1, abc.indexOf("]")).split(','); //get rid of "[" and "]"
        console.log("erstes Element: " + taskidInnerHtml.at(0));
        console.log("Anzahl der angehängten Tasks: " + taskidInnerHtml.length);

        //create button if one or more tasks and tasks not empty
        if (taskidInnerHtml.length > 0 && taskidInnerHtml.at(0) !== "") {
            console.log(taskidInnerHtml.at(1));
            const button = document.createElement("button");
            button.textContent = (toString(taskidInnerHtml.length));
            todoBox.appendChild(button);
        }

    }
}

//
//    function sendData() {
//        const todoTitleInput = document.getElementById("todoTitle");
//        const todoDescriptionInput = document.getElementById("todoDescription");
//        const todoStatusPopup = document.getElementById("statusPopup");
//
//        // const todoElement = document.createElement("todo");
//
//        // ?? const taskID = document.createElement("taskID");
//        // ?? document.todoElement.appendChild(taskID);
//
//        //const title = document.createElement("title");
//        //document.todoElement.appendChild(title);
//        //title.innerHTML = todoTitleInput.value;
//    //
//        //const status = document.createElement("status");
//        //document.todoElement.appendChild(status);
//        //status.innerHTML = todoStatusPopup.value;
//    //
//        //const description = document.createElement("description");
//        //document.todoElement.appendChild(description);
//        //description.innerHTML = todoDescriptionInput.value;
//
//        // todoStatusPopup.children[1].innerHTML //löschen
//        // todoStatusPopup.children[2].innerHTML //neu
//        // todoStatusPopup.children[3].innerHTML //geplant
//        // todoStatusPopup.children[4].innerHTML //begonnen
//        // todoStatusPopup.children[5].innerHTML //fertig
//
//        /*
//        const status = todoStatusPopup.value;
//
//        alert(status)
//
//        console.log('Status = ' + status);
//        */
//
//        console.log('<todo>' +
//            '   <ID>5</ID>' +
//            '   <taskID>1,3,5,7</taskID>' +
//            '   <title>' + todoTitleInput.innerHTML + '</title>' +
//            '   <status>' + todoStatusPopup.value + '</status>' +
//            '   <description>' + todoDescriptionInput.innerHTML + '</description>' +
//            '</todo>');
//    }
//