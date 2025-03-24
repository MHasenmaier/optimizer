import {statusPopupTodo} from "./todo.js";
import {statusPopupTask} from "./task.js";
import {maxTaskSetByFocus, maxTodoSetByFocus} from "./focus.js";

//TODO: include data import from DB
export function getTodosFromDBAsXml () {
    return `<todos>
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
    <todo>
        <id>5</id>
        <title>todoTitle 5</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
            <task>13</task>
        </tasks>
    </todo>
        <todo>
        <id>10</id>
        <title>todoTitle 10</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
            <task>14</task>
            <task>15</task>
            <task>16</task>
            <task>17</task>
        </tasks>
    </todo>
        <todo>
        <id>21</id>
        <title>todo ohne task 21</title>
        <description>Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum </description>
        <status>4</status>
        <tasks>
        </tasks>
    </todo>
</todos>`;
}

export function getTasksFromDBAsXml () {
    return `<tasks>
    <task>
        <id>1</id>
        <title>Task Titel 1</title>
        <description>Eine kreative Beschreibung für Task 1</description>
        <status>3</status>
        <todo>1</todo>
    </task>
    <task>
        <id>2</id>
        <title>Task Titel 2</title>
        <description>Beschreibung für Task 2: Hier könnte Ihre Werbung stehen!</description>
        <status>1</status>
        <todo>1</todo>
    </task>
    <task>
        <id>3</id>
        <title>Task Titel 3</title>
        <description>Task 3: Machen Sie sich bereit für Abenteuer!</description>
        <status>5</status>
        <todo>2</todo>
    </task>
    <task>
        <id>4</id>
        <title>Task Titel 4</title>
        <description>Für Task 4: Genießen Sie den Moment!</description>
        <status>2</status>
        <todo>2</todo>
    </task>
    <task>
        <id>5</id>
        <title>Task Titel 5</title>
        <description>Beschreibung für Task 5: Ein Schritt nach dem anderen.</description>
        <status>4</status>
        <todo>1</todo>
    </task>
    <task>
        <id>6</id>
        <title>Task Titel 6</title>
        <description>Task 6: Der frühe Vogel fängt den Wurm.</description>
        <status>3</status>
        <todo>3</todo>
    </task>
    <task>
        <id>7</id>
        <title>Task Titel 7</title>
        <description>Für Task 7: Vertrauen ist der Schlüssel.</description>
        <status>5</status>
        <todo>3</todo>
    </task>
    <task>
        <id>8</id>
        <title>Task Titel 8</title>
        <description>Task 8: Kleine Dinge machen einen großen Unterschied.</description>
        <status>2</status>
        <todo>3</todo>
    </task>
    <task>
        <id>9</id>
        <title>Task Titel 9</title>
        <description>Für Task 9: Denken Sie groß, handeln Sie klein.</description>
        <status>1</status>
        <todo>3</todo>
    </task>
    <task>
        <id>10</id>
        <title>Task Titel 10</title>
        <description>Task 10: Erfolg ist kein Zufall.</description>
        <status>4</status>
        <todo>1</todo>
    </task>
    <task>
        <id>11</id>
        <title>Task Titel 11</title>
        <description>Für Task 11: Bleiben Sie neugierig!</description>
        <status>3</status>
        <todo>1</todo>
    </task>
    <task>
        <id>12</id>
        <title>Task Titel 12</title>
        <description>Task 12: Lernen Sie aus Ihren Fehlern.</description>
        <status>5</status>
        <todo>1</todo>
    </task>
    <task>
        <id>13</id>
        <title>Task Titel 13</title>
        <description>Für Task 13: Teilen Sie Ihr Wissen.</description>
        <status>2</status>
        <todo>5</todo>
    </task>
    <task>
        <id>14</id>
        <title>Task Titel 14</title>
        <description>Task 14: Glauben Sie an sich selbst.</description>
        <status>1</status>
        <todo>10</todo>
    </task>
    <task>
        <id>15</id>
        <title>Task Titel 15</title>
        <description>Für Task 15: Bleiben Sie flexibel.</description>
        <status>4</status>
        <todo>10</todo>
    </task>
    <task>
        <id>16</id>
        <title>Task Titel 16</title>
        <description>Task 16: Gemeinsam sind wir stark.</description>
        <status>3</status>
        <todo>10</todo>
    </task>
    <task>
        <id>17</id>
        <title>Task Titel 17</title>
        <description>Für Task 17: Der Weg ist das Ziel.</description>
        <status>5</status>
        <todo>10</todo>
    </task>
</tasks>`;
}

export const parser = new DOMParser();
export const urlToIndex = "http://localhost:8080/optimizer/src/backend/index.php/";
export const urlWebsiteRoot = "http://localhost:8080/optimizer/src/website/";

/**
 * TODO:comment schreiben
 * @param xml
 * @returns {*[id, title, description, status, task: tasks]}
 */
export function xmlToArray(xml) {
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

        result.push({id, title, description, status, task: tasks});
    }

    return result;
}

/**
 * TODO:comment schreiben
 */
export function forwardToOverview() {
    console.log("Open link to overview.html");

    location.href = urlWebsiteRoot + "overview.html";
}

//TODO: function für Statuscheck beim Bearbeiten eines Todos vorbereitet
/**
 * compares total of todos or task with status === 4 ("in progress")
 * @param todoOrTask    expects string "todo" or "task" (function will return false if nether nor)
 * @param elementStatus expects string-number of the status of the item (function will return false if != 4)
 * @returns {boolean}   true if the status is allowed, false if there are too many items of the same type (f.e. "todo") and status (only "4")
 */
function isStatusAllowed(todoOrTask, elementStatus) {
    if (todoOrTask === "todo" && elementStatus === "4") {
        let activeTodos = 0;
        const mockArrayTodo = xmlToArray(getTodosFromDBAsXml);
        for (const todo of mockArrayTodo) {
            if (todo.status === 4) {
                activeTodos++;
            }
        }

        if (maxTodoSetByFocus < activeTodos) {
            //TODO: return feedback to user as a popup/warning/etc
            console.log("Status is not allowed. Finish Todos (" + activeTodos + " active todos) or rise the focus limit (actual limit: " + maxTodos + " )");
            return false;
        }
    }

    if (todoOrTask === "task" && elementStatus === "4") {
        let activeTasks = 0;
        const mockArrayTask = xmlToArray(getTasksFromDBAsXml);
        for (const task of mockArrayTask) {
            if (task.status === 4) {
                activeTasks++;
            }
        }

        if (maxTaskSetByFocus < activeTasks) {
            //TODO: return feedback to user as a popup/warning/etc
            console.log("Status is not allowed. Finish Tasks (" + activeTasks + " active tasks) or rise the focus limit (actual limit: " + maxTasks + " )");
            return false;
        }
    }

    return true;
}

/**
 * "Save" the collected status value of the item (dropdown option)
 * @param todoOrTask is "todo" or "task" as a string.
 * @param elementStatus is the value of the option the user has chosen via dropdown
 * @returns {boolean}   false if: 1) the status is not allowed (check Focus)
 *                                2) the function has been called with invalid parameters
 */
export function saveStatus(todoOrTask, elementStatus) {

    if (isNaN(elementStatus) || elementStatus < 0 || elementStatus > 5) {
        console.error("service.js/saveStatus got an invalid parameter. Given: " + elementStatus);
        return false;
    }

    if (todoOrTask === "todo") {
        let todoStatusValue = statusPopupTodo.options[statusPopupTodo.selectedIndex].value;
        console.log("Status Todo is: " + todoStatusValue);
        if (!isStatusAllowed(todoOrTask, elementStatus)) {
            return false;
        }
    } else if (todoOrTask === "task") {
        let taskStatusValue = statusPopupTask.options[statusPopupTask.selectedIndex].value;
        console.log("Status Task is: " + taskStatusValue);
        if (!isStatusAllowed(todoOrTask, elementStatus)) {
            return false;
        }
    } else {
        console.error("service.js/saveStatus got an invalid parameter. Given: " + todoOrTask);
        return false;
    }

    console.log("js/saveStatus set to: " + elementStatus);
    return true;
}
