// starts with all html pages
document.addEventListener('DOMContentLoaded', domContentLoaded);

//to manage to button click events
function domContentLoaded() {


    //overview.html



    //task.html


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
        //TODO: todo & task generisch zusammenfassen
        inputFocusMaxTodos.addEventListener("input", () => setFocus("todo"));
        inputFocusMaxTasks.addEventListener("input", () => setFocus("task"));
        btnFocusBack.addEventListener("click", forwardToOverview);
    }
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

