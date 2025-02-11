<?php
	header("Content-Type: application/xml");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

	//FIXME: $dbPDO wird nicht korrekt initialisiert. Server nochmal von null an aufsetzen!

	$dsn = "mysql:host=localhost; 'optimizer' ; 'utf8mb4'";

	try {
		$dbPDO = new PDO($dsn, 'root', '', [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
		]);

		$pdoStatementDatabase = $dbPDO->prepare("CREATE DATABASE IF NOT EXISTS optimizer");
		$pdoStatementDatabase->execute();
		//FIXME: bis hier gibt es bereits Fehler! dbPDO ist leer - warum?

	} catch (PDOException $e) {
		response(500, "Error in server.php/createDatabase: " . $e->getMessage());
	}

	/** create the 'optimizer' DB
	 * @return false
	 */
	function setUpDatabase(): bool
	{
		// is false if the dbPDO is empty or any exception has been thrown
		if (!(empty(createTodotable())) && !(empty(createTasktable()))) {
			return false;
		} else {
			return true;
		}
	}

	/** uses: "CREATE TABLE IF NOT EXIST todotable"
	 * @return PDO|false
	 */
	function createTodotable (): PDO|false
	{
		global $dbPDO;
		try {
			$pdoStatementTodotable = $dbPDO->prepare("CREATE TABLE IF NOT EXISTS todotable USE optimizer");
			$pdoStatementTodotable->execute();
			return $dbPDO;
		} catch (PDOException $e) {
			response(500, "createTodotable: " . $e->getMessage());
			return false;
		}
	}

	/** uses: "CREATE TABLE IF NOT EXIST tasktable"
	 * @return PDO|false
	 */
	function createTasktable (): PDO|false
	{
		global $dbPDO;
		try {
			$pdoStatementTasktable = $dbPDO->prepare("CREATE TABLE IF NOT EXISTS tasktable USE optimizer");
			$pdoStatementTasktable->execute();
			return $dbPDO;
		} catch (PDOException $e) {
			response(500, "createTasktable: " . $e->getMessage());
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