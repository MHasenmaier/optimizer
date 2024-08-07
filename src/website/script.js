const parser = new DOMParser();

loadTodosAsync();

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

        const xmlObject = parser.parseFromString(body, "text/xml");
        console.log("XML Test: loadTododsAsync \n", xmlObject);
        //return await xmlObject;

        createTodoElements(xmlObject);

    } catch (err) {
        console.error("Ein Fehler in loadTodosAsync() ist aufgetreten: \n", err);
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

    const contentOverview = document.getElementById("contentOverview");

    for (let i = 0; i < todoArray.length; i++) {
        //create TodoBox
        const todoBox = document.createElement("div");
        todoBox.setAttribute("id", todoArray[i].children[todoid].innerHTML);
        contentOverview.appendChild(todoBox);

        //create checkbox-field
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        todoBox.appendChild(checkbox);

        if (parseInt(todoArray[i].children[status].innerHTML)  === 4)
        {
            checkbox.checked = true;
        } else{
            checkbox.checked = false;
        }

        //create <a>-tag
        const todoTitleLink = document.createElement("a");
        todoTitleLink.innerHTML = todoArray[i].children[title].innerHTML;
        todoBox.appendChild(todoTitleLink);

        //create task-button
        let abc =  todoArray[i].children[taskid].innerHTML; // [ = 1. elem, .... ] = last elem.
        let taskidInnerHtml =  abc.substring(1, abc.indexOf("]")).split(','); //get rid of "[" and "]"
        console.log("erstes Element: " + taskidInnerHtml.at(0));
        console.log("Anzahl der angehängten Tasks: " + taskidInnerHtml.length);

        //create button if one or more tasks and tasks not empty
        if (taskidInnerHtml.length > 0 && taskidInnerHtml.at(0) !== "")
        {
            console.log(taskidInnerHtml.at(1));
            const button = document.createElement("button");
            button.textContent = taskidInnerHtml.length;
            todoBox.appendChild(button);
        }

    }
}