<?php
	header("Content-Type: application/xml");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
	header("Access-Control-Allow-Headers: Content-Type");

	// Datenbank-Konstanten
	const MYSQL_USERNAME = 'root';
	const MYSQL_PASSWORD = '';
	const MYSQL_DB = 'optimizer';
	const MYSQL_HOST = 'localhost';
	const MYSQL_PORT = 3306;
	const DEBUG_MODE = true;

	// Tabellennamen
	const MYSQL_TODOTABLE = 'todotable';
	const MYSQL_TASKTABLE = 'tasktable';
	const MYSQL_LINKTABLE = 'linktable';
	const MYSQL_FOKUSTABLE = 'fokustable';


	/**
	 * table name           column name     type            comments
	 * --------------------|---------------|---------------|-----------------
	 * table 1: todos
	 *                      id              int             (autoincr.) (primary key)
	 *                      titel           string
	 *                      description     string (long)
	 *                      status          int
	 *                      lastUpdate      string          (date format)
	 * table 2: tasks
	 *                      id              int             (autoincr.) (primary key)
	 *                      titel           string
	 *                      description     string (long)
	 *                      status          int
	 *                      lastUpdate      string          (date format)
	 * table 3: link
	 *                      todoId          int
	 *                      taskId          int             (primary key)
	 * table 4: focus
	 *                      todo_focus      int
	 *                      task_focus      int
	 */


	//
	// ===============================
	// DB-Setup-Funktionen
	// ===============================
	//

	/**
	 * Initialisiert die komplette Datenbankstruktur
	 *
	 * @return bool
	 */
	function setupDatabase(): bool
	{
		try {
			$dsn = "mysql:host=" . MYSQL_HOST . ";port=" . MYSQL_PORT;
			$dbRootPDO = new PDO($dsn, MYSQL_USERNAME, MYSQL_PASSWORD, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
			]);


			$stmt = $dbRootPDO->prepare("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?");
			$stmt->execute([MYSQL_DB]);


			if ($stmt->rowCount() === 0) {
				$dbRootPDO->exec("CREATE DATABASE `" . MYSQL_DB . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
			}

		} catch (PDOException $e) {
			logDebug("setupDatabase (DB-Erstellung)", $e->getMessage());
			return false;
		}

		global $dbPDO;
		try {
			$dsn = "mysql:host=" . MYSQL_HOST . ";port=" . MYSQL_PORT . ";dbname=" . MYSQL_DB;
			$dbPDO = new PDO($dsn, MYSQL_USERNAME, MYSQL_PASSWORD, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
			]);
		} catch (PDOException $e) {
			logDebug("setupDatabase (DB-Verbindung)", $e->getMessage());
			return false;
		}
		return (
			createTable(MYSQL_TODOTABLE) &&
			createTable(MYSQL_TASKTABLE) &&
			createTable(MYSQL_LINKTABLE) &&
			createTable(MYSQL_FOKUSTABLE)
		);
	}


	/**
	 * Erstellt die angegebene Tabelle, wenn sie nicht existiert
	 *
	 * @param string $tableName
	 *
	 * @return bool
	 */
	function createTable(string $tableName): bool
	{
		global $dbPDO;

		try {
			switch ($tableName) {
				case MYSQL_TODOTABLE:
					$sql = "CREATE TABLE IF NOT EXISTS todotable (
					id INT AUTO_INCREMENT PRIMARY KEY,
					title VARCHAR(255) NOT NULL,
					description TEXT,
					status INT NOT NULL,
					lastUpdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
				)";
					break;

				case MYSQL_TASKTABLE:
					$sql = "CREATE TABLE IF NOT EXISTS tasktable (
					id INT AUTO_INCREMENT PRIMARY KEY,
					title VARCHAR(255) NOT NULL,
					description TEXT,
					status INT NOT NULL,
					lastUpdate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
				)";
					break;

				case MYSQL_LINKTABLE:
					$sql = "CREATE TABLE IF NOT EXISTS linktable (
					task_id INT PRIMARY KEY,
					todo_id INT NOT NULL,
					FOREIGN KEY (task_id) REFERENCES tasktable(id),
					FOREIGN KEY (todo_id) REFERENCES todotable(id)
				)";
					break;

				case MYSQL_FOKUSTABLE:
					$sql = "CREATE TABLE IF NOT EXISTS fokustable (
					item VARCHAR(50) PRIMARY KEY,
					anzahl INT NOT NULL DEFAULT 3
				)";
					$dbPDO->exec($sql);

					// Initialeinträge einfügen
					$insertDefaults = "
					INSERT INTO fokustable (item, anzahl)
					VALUES 
						('todo_focus', 3),
						('task_focus', 3)
					ON DUPLICATE KEY UPDATE anzahl = anzahl
				";
					$dbPDO->exec($insertDefaults);
					return true;

				default:
					return false;
			}

			$dbPDO->exec($sql);
			return true;

		} catch (PDOException $e) {
			logDebug("createTable($tableName)", $e->getMessage());
			return false;
		}
	}

	//
	// ===============================
	// Helferfunktionen
	// ===============================
	//

	/**
	 * @return PDO|null
	 */
	function getPDO(): PDO|null
	{
		global $dbPDO;
		if (isset($dbPDO) && $dbPDO instanceof PDO) return $dbPDO;

		// Notfallverbindung (wenn setupDatabase nicht lief)
		try {
			$dsn = "mysql:host=" . MYSQL_HOST . ";port=" . MYSQL_PORT . ";dbname=" . MYSQL_DB;
			$dbPDO = new PDO($dsn, MYSQL_USERNAME, MYSQL_PASSWORD, [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
			]);
			return $dbPDO;
		} catch (PDOException $e) {
			logDebug("getPDO fallback", $e->getMessage());
			return null;
		}
	}


	/**
	 * Gibt eine XML-Antwort mit HTTP-Statuscode zurück
	 *
	 * @param int    $statuscode
	 * @param string $message
	 *
	 * @return bool
	 */
	function statuscode(int $statuscode, string $message = ''): bool
	{
		http_response_code($statuscode);
		$response = new SimpleXMLElement('<response/>');
		$response->addChild('status', $statuscode);
		if ($message !== '') {
			$response->addChild('message', $message);
		}
		echo $response->asXML();
		return true;
	}


	/**
	 * Gibt Debug-Ausgabe in die PHP-Errorlog (nur im Debug-Modus)
	 *
	 * @param string $context
	 * @param mixed  $data
	 *
	 * @return void
	 */
	function logDebug(string $context, mixed $data): void
	{
		if (DEBUG_MODE) {
			error_log("[$context] " . var_export($data, true));
		}
	}
