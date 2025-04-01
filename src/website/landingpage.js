import {urlToIndex, urlWebsiteRoot} from "./services.js";

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
async function checkDB() {
    console.log("Mock: Überprüfung der DB...");
    return true;    //TODO: MOCK return

    //TODO: für produktiv auskommentieren
    //try {
    //    // TODO: url korrigieren
    //    const response = await fetch(urlToIndex + 'dbstatus');
    //    const status = await response.json();
    //    return status.dbExists;
    //} catch (err) {
    //    console.error("Fehler bei DB-Check:", err);
    //    return false;
    //}
}

/**
 * set DB up if none is found
 * @returns {true}
 */
async function setupNewDB() {
    console.log("call: landingpage.js/setupNewDB");

    try {
        const response = await fetch(urlToIndex + 'setupdb', {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        return true;
    } catch (error) {
        console.error("Fehler beim Laden der Fokus-Daten:", error);
        return false;
    }
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