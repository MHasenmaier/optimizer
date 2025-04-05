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
            const lastUpdateNode = t.getElementsByTagName("lastUpdate")[0];
            const lastUpdateStr = lastUpdateNode ? lastUpdateNode.textContent : "";
            const lastUpdate = formatDate(lastUpdateStr);


            result.push({id, title, description, status, lastUpdate, task: tasks});
        }
        return result;

    } else if (type === "task") {
        const tasks = xmlDoc.getElementsByTagName("task");
        const result = [];
        for (let i = 0; i < tasks.length; i++) {
            const ta = tasks[i];

            const id = parseInt(ta.getElementsByTagName("id")[0].textContent, 10);
            const title = ta.getElementsByTagName("title")[0].textContent;
            const description = ta.getElementsByTagName("description")[0].textContent;
            const status = parseInt(ta.getElementsByTagName("status")[0].textContent, 10);

            result.push({id, title, description, status});
        }
        return result;
    }

    return [];
}

/**
 * TODO:comment schreiben
 */
export function forwardToOverview() {
    location.href = urlWebsiteRoot + "overview.html";
}

/**
 * @function buildXmlFromItem
 * @description Builds an XML string for a todo or a task object.
 * @param {string} type - "todo" or "task"
 * @param {Object} item - The item data
 * @returns {string}
 */
export function buildXmlFromObj(item, type) {
    if (type === "todo") {
        const tasksXml = (Array.isArray(item.task) && item.task.length > 0)
            ? `<tasks>\n${item.task.map(t => `<task>${t}</task>`).join("\n")}\n</tasks>`
            : '';

        return `
      <todo>
        <id>${item.id}</id>
        <title>${item.title}</title>
        <description>${item.description}</description>
        <status>${item.status}</status>
        ${tasksXml}
      </todo>`;
    } else if (type === "task") {
        return `
      <task>
        <id>${item.id}</id>
        <title>${item.title}</title>
        <description>${item.description}</description>
        <status>${item.status}</status>
      </task>`;
    }
    console.error("services.js/buildXmlFromItem got invalid parameters and occured an error.");
    return "";
}


/** TODO: comment schreiben
 * Sendet ein Item (Todo oder Task) als XML an das Backend.
 * @param {string} todoOrTask - Der API-Endpunkt ("todos" oder "tasks").
 * @param {boolean|string} xmlData - Der XML-String, der das Item beschreibt.
 */
export async function sendItemToDB(todoOrTask, xmlData) {
    const idMatch = xmlData.match(/<id>(.*?)<\/id>/);
    const id = idMatch ? parseInt(idMatch[1], 10) : -1;

    const method = id === -1 ? 'POST' : 'PUT';
    const url = id === -1 ? (urlToIndex + todoOrTask) : (urlToIndex + `${todoOrTask}?id=${id}`);

    console.log("[DEBUG] sendItemToDB() → method:", method);
    console.log("[DEBUG] sendItemToDB() → URL:", url);
    console.log("[DEBUG] sendItemToDB() → XML:", xmlData);


    try {
        const response = await fetch(url, {
            method: method,
            headers: {'Content-Type': 'application/xml'},
            body: xmlData,
        });
        const result = await response.text();
        console.log(`${todoOrTask} erfolgreich gespeichert:`, result);
    } catch (error) {
        console.error(`Fehler beim Speichern des ${todoOrTask}:`, error);
    }
}

/**
 * Returns the number of focus limit of an item ("todo" or "task")
 * @param todoOrTask    "todo" or "task"
 * @returns {Promise<number>}    integer of the maximum "Begonnen" of an item
 */
export async function getFocusLimits(todoOrTask) {
    const parser = new DOMParser();

    const xmlString = await getFocusDataFromDBXML();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");
    console.log("services.js/getFocusLimitObj -> xmlstring = " + JSON.stringify(xmlString))

    const anzahlElement = xmlDoc.querySelector(`${todoOrTask} anzahl`);

    return parseInt(anzahlElement.textContent.trim(), 10);
}

/**
 * catch the amount of active todos
 * @returns {Promise<number>}
 */
export async function countBegonnenItems(itemType) {
    let count = 0;

    if (itemType === "todo") {
        const allTodos = xmlToArray(await fetchActiveTodosFromDBXml(), "todo");
        allTodos.forEach(todo => {
            if (todo.status === 4) count++;
        });
        console.log("Todos auf 'Begonnen': " + count);
    } else if (itemType === "task") {
        const allTasks = xmlToArray(await fetchTasksFromDBXml(), "task");
        allTasks.forEach(task => {
            if (task.status === 4) count++;
        });
        console.log("Tasks auf 'Begonnen': " + count);
    }

    return count;
}

/** TODO: comment schreiben
 * Prüft, ob das Setzen des Status "begonnen" (4) für das angegebene Item zulässig ist.
 * Gibt true zurück, wenn das Limit noch nicht erreicht wurde, andernfalls false.
 * Zusätzlich wird ein negatives Feedback (über console.warn) ausgegeben.
 *
 * @param todoOrTask
 * @param {string} selectedStatus - Der ausgewählte Status (als String), z. B. "4"
 * @returns {boolean} true, wenn der Status gesetzt werden darf, sonst false.
 */
export async function validateBegonnenStatus(todoOrTask, selectedStatus) {
    if (selectedStatus !== "4") return true;

    const limits = await getFocusLimits(todoOrTask);
    const currentCount = await countBegonnenItems(todoOrTask);

    if (currentCount >= limits) {
        console.warn(`Negatives Feedback: Die maximale Anzahl an ${todoOrTask} mit "Begonnen" (${limits}) wurde überschritten.`);
        return false;
    }
    console.log("Status (Value: " + selectedStatus + ") darf gesetzt werden: Aktuelles Limit: " + limits + ` des Items (${todoOrTask}: Derzeitige Items auf 'Begonnen': ` + currentCount);
    return true;
}

/**
 * call backend for inactive todos
 * @returns {Promise<string>}
 */
export async function fetchInactiveTodosFromDBXml() {
    try {
        const response = await fetch(urlToIndex + 'inactivetodos', {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        return await response.text();
    } catch (err) {
        console.error("Fehler beim Laden der inactivetodos:", err);
        return "<todos></todos>";
    }
}

/**
 * call backend for active todos
 * @returns {Promise<string>}
 */
export async function fetchActiveTodosFromDBXml() {
    try {
        const response = await fetch(urlToIndex + 'activetodos', {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        return await response.text();
    } catch (err) {
        console.error("Fehler beim Laden der activetodos:", err);
        return "<todos></todos>";
    }
}

/**
 * call backend for focus information stored in db
 * returns default-mock data if an error occurs
 * @returns {Promise<string>}
 */
export async function getFocusDataFromDBXML() {
    try {
        const response = await fetch(urlToIndex + 'focus', {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        return await response.text();
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
}

/**
 * Holt ein einzelnes Todo anhand seiner ID vom Server
 * @param {string} todoId
 * @returns {Promise<Object|null>}
 */
export async function loadTodoById(todoId) {
    try {
        const response = await fetch(`${urlToIndex}todo?id=${todoId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        const xml = await response.text();
        const todoArray = xmlToArray(xml, "todo");
        return todoArray[0] || null;
    } catch (err) {
        console.error("Fehler beim Laden des Todos:", err);
        return null;
    }
}

/**
 * Holt alle Tasks zu einem Todo anhand der Todo-ID
 * @param {string} todoId
 * @returns {Promise<Array>}
 */
export async function loadTasksByTodoId(todoId) {
    try {
        const response = await fetch(`${urlToIndex}todotasks?todoid=${todoId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        const xml = await response.text();
        return xmlToArray(xml, "task");
    } catch (err) {
        console.error("services.js/loadTasksByTodoId: Fehler beim Laden des Tasks:", err);
        return [];
    }
}

/**
 * Lädt einen Task anhand seiner ID aus der DB
 * @param {string} taskId
 * @returns {Promise<Object|null>}
 */
export async function loadTaskById(taskId) {
    try {
        const response = await fetch(`${urlToIndex}task?id=${taskId}`, {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        const xml = await response.text();
        const taskArray = xmlToArray(xml, "task");
        return taskArray[0] || null;
    } catch (err) {
        console.error("services.js/loadTaskById: Fehler beim Laden des Tasks:", err);
        return null;
    }
}

/**
 *
 * @param dateString
 * @returns {*|string}
 */
export function formatDate(dateString) {

    if (!dateString) return "";

    const dateOnly = dateString.split(" ")[0];
    const [year, month, day] = dateOnly.split("-");

    if (!year || !month || !day) {
        // Fallback, falls Format ganz fehlt
        return dateString;
    }

    console.log(`formateDate bekam: ${dateString}`);
    console.log(`formateDate liefert: ` + [year, month, day]);

    return `${day}. ${month}. ${year}`;
}