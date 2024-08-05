
//function createTodoElement() {
//    // create <section>
//    const section = document.createElement("section");
//
//    // create <input>
//    const checkbox = document.createElement("input");
//    checkbox.type = "checkbox";
//    section.appendChild(checkbox);
//
//    // create <a>
//    const todoTitle = document.createElement("a");
//    todoTitle.textContent = "Todo title 1";
//    section.appendChild(todoTitle);
//
//    // create <button>
//    const button = document.createElement("button");
//    button.textContent = "01";
//    section.appendChild(button);
//
//    // add <section> to the website
//    document.getElementsByClassName("contentoverview").appendChild(section);
////    document.body.appendChild(section);
//}




    showTodoListener();

//document.addEventListener("DOMContentLoaded", showTodoListener() )
//{
    function showTodoListener ()
    {
        let todoArray = new XMLHttpRequest();
            todoArray.open("GET", "http://localhost/optimizer/src/backend/index.php/activetodos", true);
            todoArray.send();

            let main = document.getElementsByTagName("contentOverview");

            let responseXML = todoArray.responseXML;
            console.log(responseXML);
            let allAktiveTodos = responseXML.getElementsByTagName("todos");

        for (let i = 0; i < allAktiveTodos.length; i++)
        {
            //grap the [i]-element^^
            console.log(allAktiveTodos);
            const todo = allAktiveTodos[i];

            //extract all stuff from the todo
            const id = todo.getElementsByTagName("id");
            const taskid = todo.getElementsByTagName("taskid");
            const title = todo.getElementsByTagName("title");
            const status = todo.getElementsByTagName("status");
            const description = todo.getElementsByTagName("description");
            const createDate = todo.getElementsByTagName("createDate");
            const updateDate = todo.getElementsByTagName("updateDate");
            const lastUpdate = todo.getElementsByTagName("lastUpdate");

            //create the HTML elements and their attributes
            const todoBox = document.createElement("div");
            todoBox.setAttribute("id", id);
            main.appendChild(todoBox);

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            if (status === 5)
            {
                checkbox.checked = true;
            } else{
                checkbox.checked = false;
            }
            todoBox.appendChild(checkbox);

            const todoTitleLink = document.createElement("a");
            todoTitleLink.innerHTML = title;
            todoBox.appendChild(todoTitleLink);

            if (taskid.length >= 1)
            {
                const button = document.createElement("button");
                button.textContent = taskid;
            }

        }
    }
//}



//const title = document.getElementById('todoTitle').value;
//const status = document.getElementById('statusPopup').value;
//const description = document.getElementById('todoDescription').value;
//
//// Annahme: Du hast bereits die Werte (ID, taskID, title, status, description, lastUpdate) gesammelt
//const ID = 123; // Beispielwert, ersetze dies mit dem tatsächlichen Wert
//const taskID = 456; // Beispielwert
//
//const lastUpdate = '2024-05-29'; // Beispielwert
//
//function sendDataToBackend() {
//    // Daten an das Backend senden
//    fetch('http://localhost/optimizer/src/backend/backend.php', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({
//            functionname: 'createTodo', // Name der PHP-Funktion
//            arguments: [title, status, description]
//             })
//    })
//        .then(response => response.json())
//        .then(data => {
//            console.log('Daten erfolgreich an das Backend übertragen:', data);
//            // Hier kannst du weitere Aktionen ausführen, z. B. eine Erfolgsmeldung anzeigen
//        })
//        .catch(error => {
//            console.error('Fehler beim Senden der Daten:', error);
//        });
//}
//
//
//// JavaScript-Funktion, um die Update-Funktion aufzurufen
//function updateTodoInPHP() {
//    // Daten an das Backend senden
//    fetch('http://localhost/optimizer/src/backend/backend.php', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({
//            functionname: 'updateTodo', // Name der PHP-Funktion
//            arguments: [ID, taskID, title, status, description, lastUpdate]
//        })
//    })
//        .then(response => response.json())
//        .then(data => {
//            console.log('Daten erfolgreich an das Backend übertragen:', data);
//            // Hier kannst du weitere Aktionen ausführen, z. B. eine Erfolgsmeldung anzeigen
//        })
//        .catch(error => {
//            console.error('Fehler beim Senden der Daten:', error);
//        });
//}
//
//// Beispielaufruf der Funktion (z. B. durch Klicken eines Buttons)
//
//updateTodoInPHP.addEventListener('click', updateTodoInPHP);
