const parser = new DOMParser();
const bodyOverview = document.getElementById("bodyOverview");
const classContentOverview = document.querySelector('.contentOverview');
const pOverview = document.querySelectorAll('p');
const bodyTodoPage = document.getElementById("bodyTodoPage");
const bodyLandingPage = document.getElementById("bodyLanding");
const arrAllTodoButtons = document.querySelectorAll('.todoButton');
const btnLanding = document.getElementById("landingButton");
const btnLandingImg = document.getElementById("landingButtonImage");
const urlToIndex = "http://localhost:8080/optimizer/src/backend/index.php/";

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
</todos>`;

// starts with all html pages
document.addEventListener('DOMContentLoaded', domContentLoaded);

//to manage to button click events
function domContentLoaded() {
    if (bodyLandingPage) {
        btnLanding.addEventListener("click", setUpDB);      //FIXME: funktionsnamen ("setUpDB") ändern
        btnLandingImg.addEventListener("click", setUpDB);   //FIXME: funktionsnamen ("setUpDB") ändern
    }

    if (bodyOverview) {
        console.log("Overview loading. . .");
        //FIXME: get rid of the mock data "mockData"
        createTodoOverview(xmlToArray(mockXMLData));
        console.log(xmlToArray(mockXMLData));
            classContentOverview.addEventListener('click', function(event) {
            if(event.target.tagName === 'P') {  //click todo
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
            } else if (event.target.tagName === 'input') {  //click checkbox
                //FIXME:
                console.log("Checkbox checked: ", event.target.parentElement.parentElement.querySelector('p').innerText);
            }
        });
    }

    if (bodyTodoPage) {
        console.log("Todo page loading . . .")
        //sendData();
    }
}

//FIXME: how to debug, if the function fails? return false?
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

        result.push({ id, title, description, status, task: tasks });
    }

    return result;
}

// for page: overview
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
 * handles the clickevents triggered by buttons at overview-page
 */
async function eventOverview() {
    console.log("Step 0: Overview finished loading.\nscript.js/eventOverview startet. . .");

    eventHandlerOverview()
        .then(specificId => {
            console.log(`Step 1: specificId = ${specificId}`);
            fetchDBTodo(specificId)
                .then (todoXml => {
                    console.log(`Step 2: fetched todoXml = ${JSON.stringify(todoXml)}`);
                    isTodoHTMLLoaded();
                    renderTodoInAddTodo(todoXml);
                })
                .catch(err => console.error(`script.js/eventOverview - Something went wrong ${err}`));
        })

//    //Step 1: load the click-event-handler and catch the button ID if clicked
//    eventHandlerOverview().then(resp => {specificId = resp});
//    //const specificId = await eventHandlerOverview();
//    console.log(`Step 1: specificId = ${specificId}`);
//
//    //Step 2: send the ID to the backend and fetch the todo data
//    const todoXml = await fetchDBTodo(specificId);
//    console.log(`Step 2: fetched todoXml = ${JSON.stringify(todoXml)}`);
//
//    //Step 3: load the todo page
//    const isTodoPageLoaded = await isTodoHTMLLoaded();
//    console.log(`Step 3: isTodoPageLoaded? = ${isTodoPageLoaded}`);
//
//    //Step 4: fill the todo page with todo data
//    await renderTodoInAddTodo(todoXml);
}

//TODO: check DB connection / valid DB data return
/**
 * take the provided ID and fetch the todo data of it from the DB
 * returns the XML formatted todo data if promise is fulfilled
 * @param inputSpecificID
 * @returns {Promise<Document>}
 */
async function fetchDBTodo (inputSpecificID) {
    console.log(`function fetchDBTodo startet with ${inputSpecificID} . . .`);
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
            console.log("frontend error in getSpecificTodo:\n" , err , "\n");
        }
    }
}

//FIXME: rename function & maybe rewrite function
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

//FIXME: still relevant?
/**
 * async function to switch to the (Add-New-)To-do-Page
 * returns 'true' if page is loaded
 * @returns {true}
 */
async function isTodoHTMLLoaded() {
    console.log("function isTodoHTMLLoaded startet . . .");
    window.location.href = "http://localhost:8080/optimizer/src/website/todo.html";
    return new Promise(resolve => {
        window.addEventListener('load', () => {
            console.log("isTodoHTMLLoaded: Todo Page loaded . . .");
            resolve(true);
        });
    });
}