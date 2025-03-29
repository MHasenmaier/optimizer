import {getTasksFromDBAsXml, getTodosFromDBAsXml} from "./mockdata.js";

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
    const parser = new DOMParser();
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
 * TODO:comment schreiben
 */
export function forwardToOverview() {
    console.log("Open link to overview.html");

    location.href = urlWebsiteRoot + "overview.html";
}

/**
 * @function buildXmlFromItem
 * @description Builds an XML string for a todo or a task object.
 * @param {string} type - "todo" or "task"
 * @param {Object} item - The item data
 * @returns {boolean, string}
 */
export function buildXmlFromObj(item, type) {
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

/** TODO: comment schreiben
 * Sendet ein Item (Todo oder Task) als XML an das Backend.
 * @param {string} todoOrTask - Der API-Endpunkt ("todos" oder "tasks").
 * @param {boolean|string} xmlData - Der XML-String, der das Item beschreibt.
 */
export async function sendItemToDB(todoOrTask, xmlData) {
    console.log(`MOCK: Sende ${todoOrTask} als XML:`, xmlData);

    // Extrahiere die ID aus dem XML-String
    //FIXME: was hat es mit dem "match is not a function" auf sich?
    const idMatch = xmlData.match(/<id>(.*?)<\/id>/);
    const id = idMatch ? parseInt(idMatch[1], 10) : -1;

    const method = id === -1 ? 'POST' : 'PUT';
    const url = id === -1 ? (urlToIndex + todoOrTask) : (urlToIndex + `${todoOrTask}?id=${id}`);

    console.log("Task (ID: " + id + ") zur DB gesendet\nMethode: " + method + "\nUrl: " + url);

    // Zukünftiger echter API-Aufruf
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
 * Returns the number of focus limit of an item ("todo" or "task")
 * @param todoOrTask    "todo" or "task"
 * @returns {number}    integer of the maximum "Begonnen" of an item
 */
export function getFocusLimits(todoOrTask) {
    const parser = new DOMParser();

    const xmlString = getFocusDataFromDBXML();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    console.log("services.js/getFocusLimitObj -> xmlstring = " + JSON.stringify(xmlString))

    const anzahlElement = xmlDoc.querySelector(`${todoOrTask} anzahl`);

    return parseInt(anzahlElement.textContent.trim(), 10);
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
        console.log("Todos auf 'Begonnen: " + count);
    } else if (itemType === "task") {
        const allTasks = xmlToArray(getTasksFromDBAsXml(), "task");
        allTasks.forEach(task => {
            if (task.status === 4) count++;
        });
        console.log("Tasks auf 'Begonnen: " + count);
    }
    return count;
}

/** TODO: comment schreiben
 * Prüft, ob das Setzen des Status "begonnen" (4) für das angegebene Item zulässig ist.
 * Gibt true zurück, wenn das Limit noch nicht erreicht wurde, andernfalls false.
 * Zusätzlich wird ein negatives Feedback (über console.warn) ausgegeben.
 *
 * @param {string} itemType - "todo" oder "task"
 * @param {string} selectedStatus - Der ausgewählte Status (als String), z. B. "4"
 * @returns {boolean} true, wenn der Status gesetzt werden darf, sonst false.
 */
export function validateBegonnenStatus(itemType, selectedStatus) {
    if (selectedStatus !== "4") return true;

    const limits = getFocusLimits(itemType);
    const currentCount = countBegonnenItems(itemType);

    if (currentCount >= limits) {
        console.warn(`Negatives Feedback: Die maximale Anzahl an ${itemType}s mit "Begonnen" (${limits}) wurde überschritten.`);
        return false;
    }
    console.log("Status (Value: " + selectedStatus + ") darf gesetzt werden: Aktuelles Limit: " + limits + " des Items: " + itemType + "\nDerzeitige Items auf 'Begonnen': " + currentCount);
    return true;
}

/**
 * get focus data from db
 */
export function getFocusDataFromDBXML() {
    console.log("MOCK: Lade Fokus-Daten als XML...");
    return `
    <focus>
        <todo>
            <anzahl>3</anzahl>
        </todo>
        <task>
            <anzahl>3</anzahl>
        </task>
    </focus>`;

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