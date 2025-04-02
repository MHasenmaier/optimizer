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
 * Startet die App – prüft, ob eine DB vorhanden ist, erstellt ggf. eine neue
 * und wechselt zur Overview-Seite.
 * @param event
 */
async function landingStartApp(event) {
    console.log("Change page to overview.html", event);

    const dbExists = await checkDB();

    if (!dbExists) {
        console.log("Keine DB vorhanden… versuche, eine neue anzulegen.");
        const setupSuccess = await setupNewDB();
        if (!setupSuccess) {
            console.error("DB konnte nicht erstellt werden!");
            return;
        }

        const dbExistsAfterSetup = await checkDB();
        if (!dbExistsAfterSetup) {
            console.error("DB-Check nach Setup fehlgeschlagen!");
            return;
        }
    }
    location.href = urlWebsiteRoot + "overview.html";
}

/**
 * Prüft, ob eine Datenbank existiert.
 * @returns {Promise<boolean>}
 */
async function checkDB() {
    console.log("Überprüfung der DB. . .");

    try {
        const response = await fetch(urlToIndex + 'dbcheck');
        if (response.status === 200) console.log("DB existiert. . .");
        return response.status === 200;
    } catch (err) {
        console.error("Fehler bei DB-Check:", err);
        return false;
    }
}

/**
 * Legt eine neue Datenbank an, wenn keine existiert.
 * @returns {Promise<boolean>}
 */
async function setupNewDB() {
    console.log("call: landingpage.js/setupNewDB");

    try {
        const response = await fetch(urlToIndex + 'setupdb', {
            method: 'GET',
            headers: {'Content-Type': 'application/xml'}
        });
        return response.status === 200;
    } catch (error) {
        console.error("Fehler beim Einrichten der DB:", error);
        return false;
    }
}