import {urlWebsiteRoot} from "./services.js";

const bodyLandingPage = document.getElementById("bodyLanding");
const btnLanding = document.getElementById("buttonLanding");
const btnLandingImg = document.getElementById("imageLanding");


document.addEventListener('DOMContentLoaded', landingPageLoaded);

function landingPageLoaded() {
    if (bodyLandingPage) {
        btnLanding.addEventListener("click", landingStartApp);
        btnLandingImg.addEventListener("click", landingStartApp);
    }
}


/**
 * TODO: write comment
 * @param event
 */
function landingStartApp(event) {
    console.log("Change page to overview.html", event);

    if (!checkDB()) {
        console.log("DB wird erstellt...");
        if (!setupNewDB()) {
            console.error("DB konnte nicht erstellt werden!");
            return;
        }
    }

    if (!checkDBTables()) {
        console.log("Tabellen werden erstellt...");
        if (!setupDBTables()) {
            console.error("DB-Tabellen konnten nicht erstellt werden!");
            return;
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
    console.log("Mock: Überprüfung der DB...");
    const dbExists = true; // TODO: Später durch echte DB-Abfrage ersetzen
    return dbExists;
}

/**
 * set DB up if none is found
 * @returns {true}
 */
function setupNewDB() {
    console.log("Mock: Datenbank wird erstellt...");
    return true;
}

/**
 * TODO:comment schreiben
 * @returns {boolean}
 */
function checkDBTables() {
    console.log("Mock: Überprüfung der Tabellen...");
    const tablesExist = true; // TODO: Später durch echte DB-Abfrage ersetzen
    return tablesExist;
}

/**
 * TODO:comment schreiben
 * @returns {boolean}
 */
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
    console.log("Mock: Erstelle Tabellen für Todos, Tasks, Links & Fokus...");

    // SQL-Code auskommentiert für zukünftige Implementierung
    /*
    CREATE TABLE todotable (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255),
        description TEXT,
        status INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE tasktable (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(255),
        description TEXT,
        status INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE linktable (
        todoId INT,
        taskId INT,
        FOREIGN KEY (todoId) REFERENCES todotable(id),
        FOREIGN KEY (taskId) REFERENCES tasktable(id)
    );

    CREATE TABLE focustable (
        item VARCHAR(10) PRIMARY KEY,
        anzahl INT
    );
    */

    console.log("Tabellen erfolgreich (mocked) erstellt.");
    return true;
}