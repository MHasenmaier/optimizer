<?php
	header("Content-Type: application/xml");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

	//FIXME: $dbPDO wird nicht korrekt initialisiert. Server nochmal von null an aufsetzen!

	const MYSQL_USERNAME = 'root';
	const MYSQL_PASSWORD = '';
	const MYSQL_DB = 'optimizer';
	const DNS = "mysql:host=localhost:8080;dbname=optimizer";
	const MYSQL_TODOTABLE = 'todotable';
	const MYSQL_TASKTABLE = 'tasktable';
	const MYSQL_LINKTABLE = 'linktable';



	try {
		$dbPDO = new PDO(DNS, MYSQL_USERNAME, MYSQL_PASSWORD, [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		]);

		$pdoStatementDatabase = $dbPDO->query("CREATE DATABASE IF NOT EXISTS optimizer");
		$pdoStatementDatabase->execute();
		//FIXME: bis hier gibt es bereits Fehler! dbPDO ist leer - warum?

	} catch (PDOException $e) {
		response(500, "Error in server.php/createDatabase: " . $e->getMessage());
	}

	/** create the 'optimizer' DB
	 * @return false
	 */
	function setupDatabase(): bool
	{
		// is false if the dbPDO is empty or any exception has been thrown
		if (!(empty(createTodotable(MYSQL_TODOTABLE, MYSQL_DB)))
			&& !(empty(createTasktable(MYSQL_TASKTABLE, MYSQL_DB)))
			&& !(empty(createLinktable(MYSQL_LINKTABLE, MYSQL_DB))))
		{
			echo "Fehler in setUpDatabase/server.php";
			return false;
		} else {
			echo "setUpDatabase/server.php erfolgreich";
			return true;
		}
	}

	/** uses: "CREATE TABLE IF NOT EXIST todotable"
	 *
	 * @param $todotable
	 * @param $database
	 *
	 * @return PDO|false
	 */
	function createTodotable ($todotable, $database): PDO|false
	{
		global $dbPDO;
		try {
			$pdoStatementTodotable = $dbPDO->prepare("CREATE TABLE IF NOT EXISTS $todotable USE $database");
			$pdoStatementTodotable->execute();
			return $dbPDO;
		} catch (PDOException $e) {
			response(500, "server.php/createTodotable: " . $e->getMessage());
			return false;
		}
	}

	/** uses: "CREATE TABLE IF NOT EXIST tasktable"
	 *
	 * @param $tasktable
	 * @param $database
	 *
	 * @return PDO|false
	 */
	function createTasktable ($tasktable, $database): PDO|false
	{
		global $dbPDO;
		try {
			$pdoStatementTasktable = $dbPDO->prepare("CREATE TABLE IF NOT EXISTS $tasktable USE $database");
			$pdoStatementTasktable->execute();
			return $dbPDO;
		} catch (PDOException $e) {
			response(500, "server.php/createTasktable: " . $e->getMessage());
			return false;
		}
	}

	function createLinktable ($linktable, $database): PDO|false
	{
		global $dbPDO;
		try {
			$pdoStatementTodotable = $dbPDO->prepare("CREATE TABLE IF NOT EXISTS $linktable USE $database");
			$pdoStatementTodotable->execute();
			return $dbPDO;
		} catch (PDOException $e) {
			response(500, "server.php/createLinktable: " . $e->getMessage());
			return false;
		}
	}

	function response ($statusNr, $statusMsg = ''): void
	{
		$response = new SimpleXMLElement('<response/>');
		$response->addChild('status', $statusNr);
		if ($statusNr == 500) {
			$response->addChild('message', $statusMsg);
		}
		echo $response->asXML();
	}