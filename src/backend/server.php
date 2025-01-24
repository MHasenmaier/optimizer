<?php
	header("Content-Type: application/xml");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");


	/** to test if the DB exists
	 * @return bool
	 */
	function testDatabase (): bool
	{
		global $dbPDO;

		try {
			if (is_null($dbPDO)) {
				return false;
			} else {
				return true;
			}

		} catch (PDOException $e) {
			response(500, $e->getMessage());
			return false;
		}
	}

	/** create the 'optimizer' DB
	 * @return PDO|false
	 */
	function createNewDB(): PDO|false
	{
		$dsn = "mysql:host=localhost; 'optimizer' ; 'utf8mb4'";
		try {
			$dbPDO = new PDO($dsn, 'root', '', [
				PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
			]);
			$sql = "CREATE DATABASE IF NOT EXISTS optimizer";

			$pdoStatement = $dbPDO->prepare($sql);
			$pdoStatement->execute();
			return $dbPDO;
		} catch (PDOException $e) {
			response(500, $e->getMessage());
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

	/**
	 * tests if the DB is already created - if not creates the 'optimizer' DB
	 * send a message via echo: 200 => success / 500 + message => error
	 */
	if (!testDatabase()) {
		$dbPDO = createNewDB();
		response(201);
	} else {
		response(200);
	}