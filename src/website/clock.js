/**
 * set time and date at overview.html
 */
export function updateDateTime() {
    const dateElement = document.getElementById("date");
    const timeElement = document.getElementById("time");

    const now = new Date();

    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    dateElement.textContent = now.toLocaleDateString('de-DE', options);

    const timeOptions = { hour: '2-digit', minute: '2-digit' };
    timeElement.textContent = now.toLocaleTimeString('de-DE', timeOptions);
}