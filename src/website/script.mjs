let main = document.getElementsByTagName('main');
//for(let i = 0; i < 12; i++) {
//    main.innerHTML = '<section><input type="checkbox"><a>Neuer Todo Titel ' + (i+1) + '</a><button>' + (i+1) + '</button></section>';
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
