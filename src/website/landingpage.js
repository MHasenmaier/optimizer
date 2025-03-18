import {urlWebsiteRoot} from "./services.js";

const bodyLandingPage = document.getElementById("bodyLanding");
const btnLanding = document.getElementById("buttonLanding");
const btnLandingImg = document.getElementById("imageLanding");


document.addEventListener('DOMContentLoaded', landingPageLoaded);

function landingPageLoaded () {
    if (bodyLandingPage) {
        btnLanding.addEventListener("click", landingStartApp);
        btnLandingImg.addEventListener("click", landingStartApp);
    }
}


//TODO: mocked function
function landingStartApp(event) {
    console.log("Change page to overview.html" + event);

    //TODO: install function to check existence of DB and tables, return true/false
    const checkedDB = checkDB();
    const checkedDBTables = checkDBTables();

    if (!checkedDB) {
        console.log("DB will be set up ... soon");
        if (!setupNewDB()) {
            console.error("DB couldn't set up\nCheck DB!");
        }
    }

    if (!checkedDBTables) {
        console.log("Tables will be set up ... soon")
        if (!setupDBTables()) {
            console.error("DB Tables couldn't set up!\nCheck DB!");
        }
    }

    location.href = urlWebsiteRoot + "overview.html";
}

/**
 * DB and table status functions
 */

/**
 * checks if a DB exists
 * @returns {boolean}
 */
function checkDB() {
    console.log("DB will be checked ... soon");
    //TODO: install DB call to check if DB is accessible
    const dbState = true;
    console.log("Status DB is: " + dbState);
    return dbState;
}

/**
 * set DB up if none is found
 * @returns {true}
 */
function setupNewDB() {
    console.log("DB and tables will be ready for business ... soon");
    //TODO: contact URL for set up a new DB
    return true;
}

function checkDBTables() {
    console.log("Tables will be checked ... soon");
    //TODO: install DB call to check if the tables are accessible
    const tableState = true;
    console.log("Status Tables is: " + tableState);
    return tableState;
}

function setupDBTables() {
    console.log("Tables of the DB will be ready for business ... soon");
    /** TODO: SQL line to set up tables in the DB
     * table name           column name     type            comments
     * --------------------|---------------|---------------|-----------------
     * Tabelle 1: todos
     *                      id              int             (autoincr.) (primary key)
     *                      titel           string
     *                      beschreibung    string (long)
     *                      status          int
     *                      erstelldatum    string          (von db erstellt)
     * Tabelle 2: tasks
     *                      id              int             (autoincr.) (primary key)
     *                      titel           string
     *                      beschreibung    string (long)
     *                      status          int
     *                      erstelldatum    string          (von db erstellt)
     * Tabelle 3: link
     *                      todoId          int
     *                      taskId          int
     * Tabelle 4: focus
     *                      todoImFokus     int
     *                      taskImFokus     int
     */
    return true;
}



/**
 * necessitate of function unknown
 */

//TODO: check DB connection / valid DB data return
/**
 * take the provided ID and fetch the todo data of it from the DB
 * returns the XML formatted todo data if promise is fulfilled
 * @param inputSpecificID
 * @returns {Promise<Document>}
 */
async function fetchDBTodo(inputSpecificID) {
    console.log(`function fetchDBTodo started with element #${inputSpecificID} . . .`);
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
            console.log("frontend error in getSpecificTodo:\n", err, "\n");
        }
    }
}