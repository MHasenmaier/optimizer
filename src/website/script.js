const parser = new DOMParser();
const contentOverview = document.getElementById("contentOverview");
const bodyTodoPage = document.getElementById("bodyTodoPage");
const bodyLandingPage = document.getElementById("bodyLanding");
const arrAllTodoButtons = document.querySelectorAll('.todoButton');
const btnLanding = document.getElementById("landingButton");
const btnLandingImg = document.getElementById("landingButtonImage");
const urlToIndex = "http://localhost:8080/optimizer/src/backend/index.php/";

// starts with all html pages
document.addEventListener('DOMContentLoaded', domContentLoaded);

// to manage to button click events
function domContentLoaded() {
    if (bodyLandingPage) {
        btnLanding.addEventListener("click", setUpDB);      //funktionsnamen ("setUpDB") ändern
        btnLandingImg.addEventListener("click", setUpDB);   //funktionsnamen ("setUpDB") ändern
    }

    if (contentOverview) {
        console.log("Overview loading. . .");
        eventOverview().then({
            console
        });
    }

    if (bodyTodoPage) {
        console.log("bodyTodoPage loading . . .")
        //sendData();
    }
}
//FIXME: funktion neu schreiben - "await fetch(..) funktioniert nicht richtig. syntaxfehler?
        //          async function setUpDB() {
        //              console.log("setUpDB/script.js loaded!");   //wird ausgegeben
        //              try {
        //                  const response = await fetch(urlToIndex + 'setUpDB', {
        //                      mode: 'cors',
        //                      method: 'GET'
        //                  })
        //                  console.log("fetch abgeschlossen");     //wird nicht ausgegeben
        //                      /*const fetchResponse = */await console.log(response);
        //                  //console.log("fetchResponse in setUpDB/script.js:\n" + fetchResponse);
        //                      //.then((response) => {response.text(); console.log("response in setUpDB/script.js ist:\n" + response); return true;})
        //                      //.then((input) => input)
        //                      //.then(() => {window.location.href = "overview.html"})
        //                      //.then(() => {loadTodosAsyncForOverview()})
        //                  console.log("erfolgreich in try");
        //                  return true;
        //              } catch (error) {
        //                  console.error("Frontend error in script.js/setUpDB: " . error);
        //                  return false;
        //              }
        //          }

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
        //let status = todo.getElementsByTagName("status")[0].textContent;

        // Create the div for the todo
        const todoDiv = document.createElement("div");
        todoDiv.setAttribute("id", id);
        todoDiv.setAttribute("class", "todoCountClass");

        //Set the title of the todo
        const todoTitle = document.createElement("button");
        todoTitle.setAttribute("class", "todoButton");
        todoTitle.innerHTML = title;

        todoTitle.setAttribute("href", urlToIndex + "todo/?id=" + id);

        // Create a new input checkbox element
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";

        //Task box
        const taskBox = document.createElement("button");
        taskBox.setAttribute("class", "taskButton");

        // TODO: box einblenden mit ANZAHL angehängter tasks

        // Append the newly created div to an existing container on your page
        contentOverview.appendChild(todoDiv);

        //order of the includes is important
        todoDiv.appendChild(checkbox);
        todoDiv.appendChild(todoTitle);
        todoDiv.appendChild(taskBox);

        console.log(todoDiv);
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

/**
 * async function - click event listener for all todo buttons to get the ID of the clicked todo
 * returns string - ID number if promise is fulfilled
 * @returns {Promise<void>}
 */
async function eventHandlerOverview () {
    return new Promise((resolve) => {

        console.log("function eventHandlerOverview: resolve = " , resolve);
        arrAllTodoButtons.forEach(button => {
            button.addEventListener('click', (event) => {
            //get ID of the todo (parent div of the button)
                console.log("function eventHandlerOverview: button clicked . . .");
                const id = (event.target.parentElement.id);
                console.log(`clicked button ID = ${id}`);
                resolve(id);
            });
        });
    });
}

/**
 * take the provided ID and fetch the todo data of it from the DB
 * returns the XML formatted todo data if promise is fulfilled
 * @param inputSpecificID
 * @returns {Promise<Document>}
 */
async function fetchDBTodo (inputSpecificID) {
    console.log(`function fetchDBTodo startet with ${inputSpecificID} . . .`);
    const parser = new DOMParser();// ?? notwendig?
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

/**
 *
 * @returns Document {XMLDocument}
 */
//function parseXMLString(inputString) {
//    const parser = new DOMParser();
//    return parser.parseFromString(inputString.trim, "application/xml");
//}

// for page: todo
