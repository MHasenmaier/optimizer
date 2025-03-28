//TODO: include data import from DB
import {statusPopupTodo} from "./todo.js";
import {getTodosFromDBAsXml, getTasksFromDBAsXml} from "./mockdata.js";

export const parser = new DOMParser();
export const urlToIndex = "http://localhost:8080/optimizer/src/backend/index.php/";
export const urlWebsiteRoot = "http://localhost:8080/optimizer/src/website/";

/**TODO:comment schreiben
 * @function xmlToArray
 * @description Converts an XML string of either todos or tasks into a JavaScript array.
 * @param {string} xml - The XML string to parse.
 * @param {string} type - "todo" or "task"
 * @returns {Array} - Array of todo- or task-objects
 */
export function xmlToArray(xml, type) {
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    if (type === "todo") {
        const todos = xmlDoc.getElementsByTagName("todo");
        const result = [];
        for (let i = 0; i < todos.length; i++) {
            const t = todos[i];

            const id = parseInt(t.getElementsByTagName("id")[0].textContent, 10);
            const title = t.getElementsByTagName("title")[0].textContent;
            const description = t.getElementsByTagName("description")[0].textContent;
            const status = parseInt(t.getElementsByTagName("status")[0].textContent, 10);

            const tasks = Array.from(t.getElementsByTagName("task")).map(taskNode => parseInt(taskNode.textContent, 10));

            result.push({ id, title, description, status, task: tasks });
        }
        return result;
    }

    else if (type === "task") {
        const tasks = xmlDoc.getElementsByTagName("task");
        const result = [];
        for (let i = 0; i < tasks.length; i++) {
            const ta = tasks[i];
            const id = parseInt(ta.getElementsByTagName("id")[0].textContent, 10);
            const title = ta.getElementsByTagName("title")[0].textContent;
            const description = ta.getElementsByTagName("description")[0].textContent;
            const status = parseInt(ta.getElementsByTagName("status")[0].textContent, 10);
            // Optional: das zugehörige todo kann man hier auslesen
            result.push({ id, title, description, status });
        }
        return result;
    }

    return [];
}


/**
 * get the todos from the db
 * @returns {*} Array[{todo-obj}, {todo-obj}, {...}]
 */
export async function getTodos() {
    // Momentan Mock-Daten (synchron):
    return xmlToArray(getTodosFromDBAsXml(),"todos");

    // Zukünftige DB-Abfrage via fetch mit async/await:
    /*
    try {
      const response = await fetch(urlToIndex + 'todos', {
        method: 'GET',
        headers: { 'Content-Type': 'application/xml' }
      });
      const xmlString = await response.text();
      return xmlToArray(xmlString);
    } catch (error) {
      console.error('Error fetching todos:', error);
      return [];
    }
    */
}

/**
 * @function buildXmlFromItem
 * @description Builds an XML string for a todo or a task item.
 * @param {string} type - "todo" or "task"
 * @param {Object} item - The item data
 * @returns {boolean, string}
 */
export function buildXmlFromItem(item, type) {
    if (type === "todo") {
        return `
      <todo>
        <id>${item.id}</id>
        <title>${item.title}</title>
        <description>${item.description}</description>
        <status>${item.status}</status>
        <tasks>
          ${item.task.map(t => `<task>${t}</task>`).join("\n")}
        </tasks>
      </todo>`;
    }
    else if (type === "task") {
        return `
      <task>
        <id>${item.id}</id>
        <title>${item.title}</title>
        <description>${item.description}</description>
        <status>${item.status}</status>
      </task>`;
    }
    console.error("services.js/buildXmlFromItem got invalid parameters and occured an error.");
    return false;
}

/**
 * TODO:comment schreiben
 */
export function forwardToOverview() {
    console.log("Open link to overview.html");

    location.href = urlWebsiteRoot + "overview.html";
}


/** TODO: comment schreiben
 * Sendet ein Item (Todo oder Task) als XML an das Backend.
 * @param {string} todoOrTask - Der API-Endpunkt ("todos" oder "tasks").
 * @param {string} xmlData - Der XML-String, der das Item beschreibt.
 */
export async function sendItemToDB(todoOrTask, xmlData) {
    console.log(`MOCK: Sende ${todoOrTask} als XML:`, xmlData);

    // Extrahiere die ID aus dem XML-String
    const idMatch = xmlData.match(/<id>(.*?)<\/id>/);
    const id = idMatch ? parseInt(idMatch[1], 10) : -1;
    // Wähle Methode und URL abhängig davon, ob das Item neu ist oder existiert.
    const method = id === -1 ? 'POST' : 'PUT';
    const url = id === -1 ? (urlToIndex + todoOrTask) : (urlToIndex + `${todoOrTask}?id=${id}`);

    // Zukünftiger echter API-Aufruf mit async/await:
    /*
    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/xml' },
        body: xmlData,
      });
      const data = await response.text();
      console.log(`${todoOrTask.slice(0, -1)} erfolgreich gespeichert:`, data);
    } catch (error) {
      console.error(`Fehler beim Speichern des ${todoOrTask.slice(0, -1)}:`, error);
    }
    */
}

/**
 * TODO: comment schreiben
 * @param xmlTodo
 * @returns {Promise<void>}
 */
export function sendTodoToDB(xmlTodo) {
    return sendItemToDB('todos', xmlTodo);
}

/**
 * TODO: comment schreiben
 * @param xmlData
 * @returns {Promise<void>}
 */
export function sendTaskToDB(xmlData) {
    return sendItemToDB('tasks', xmlData);
}

/**
 * TODO: comment schreiben
 * @returns {{todos: number, tasks: number}}
 */
export async function getFocusLimitsObj() {
    // Der XML-String wird asynchron abgerufen.
    const xmlString = await getFocusDataFromDBXML();
    const xmlDoc = new DOMParser().parseFromString(xmlString, "application/xml");
    const todosAnzahl = parseInt(xmlDoc.querySelector("todo > anzahl").textContent, 10);
    const tasksAnzahl = parseInt(xmlDoc.querySelector("task > anzahl").textContent, 10);
    return { todos: todosAnzahl, tasks: tasksAnzahl };
}

/**
 * TODO: comment schreiben
 * @returns {Promise<void>}
 */
async function handleStatusChange() {
    const selectedStatus = statusPopupTodo.value;

    const limitOk = validateBegonnenStatus("todo", selectedStatus);

    if (!limitOk) {
        console.warn("to many 'in progress' todos");
        statusPopupTodo.value = "";
        return;
    }
    // TODO: Erfolgsfall → status darf gesetzt werden
}


/** TODO: comment schreiben
 * Zählt, wie viele Items des Typs (todo/task) den Status "begonnen" (4) haben.
 * Hier wird angenommen, dass die Daten via xmlToArray aus den Mock-Daten geholt werden.
 */
function countBegonnenItems(itemType) {
    let count = 0;
    if (itemType === "todo") {
        const allTodos = xmlToArray(getTodosFromDBAsXml(), "todo");
        allTodos.forEach(todo => {
            if (todo.status === 4) count++;
        });
    } else if (itemType === "task") {
        const allTasks = xmlToArray(getTasksFromDBAsXml(), "task");
        allTasks.forEach(task => {
            if (task.status === 4) count++;
        });
    }
    return count;
}

/** TODO: comment schreiben
 * Prüft, ob das Setzen des Status "begonnen" (4) für den angegebenen Itemtyp zulässig ist.
 * Gibt true zurück, wenn noch nicht das Limit erreicht ist,
 * andernfalls false. Zusätzlich wird ein negatives Feedback (über console.warn) ausgegeben.
 *
 * @param {string} itemType - "todo" oder "task"
 * @param {string} selectedStatus - Der ausgewählte Status (als String), z. B. "4"
 * @returns {boolean} true, wenn der Status gesetzt werden darf, sonst false.
 */
function validateBegonnenStatus(itemType, selectedStatus) {
    if (selectedStatus !== "4") return true;

    const limits = getFocusLimitsObj();
    const currentCount = countBegonnenItems(itemType);
    const allowedLimit = itemType === "todo" ? limits.todos : limits.tasks;

    if (currentCount >= allowedLimit) {
        console.warn(`Negatives Feedback: Die maximale Anzahl an ${itemType}s mit "Begonnen" (${allowedLimit}) wurde erreicht.`);
        return false;
    }
    return true;
}

/**
 * get focus data from db
 */
export async function getFocusDataFromDBXML() {
    console.log("MOCK: Lade Fokus-Daten als XML...");
    // Momentan werden Mock-Daten zurückgegeben:
    const xmlMock = `
    <focus>
        <todo>
            <anzahl>3</anzahl>
        </todo>
        <task>
            <anzahl>3</anzahl>
        </task>
    </focus>`;
    return xmlMock;

    // Zukünftiger echter API-Aufruf mit async/await:
    /*
    try {
        const response = await fetch(urlToIndex + 'focus', {
            method: 'GET',
            headers: { 'Content-Type': 'application/xml' }
        });
        const xmlString = await response.text();
        return xmlString;
    } catch (error) {
        console.error("Fehler beim Laden der Fokus-Daten:", error);
        // Fallback: Rückgabe von Default-Mock-Daten
        return `
        <focus>
            <todo>
                <anzahl>3</anzahl>
            </todo>
            <task>
                <anzahl>3</anzahl>
            </task>
        </focus>`;
    }
    */
}