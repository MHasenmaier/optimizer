<?php
	header("Content-Type: application/xml");
	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type");

     $hostName = 'localhost';
     $dbName = 'optimizer';
     $userName = 'root';
     $password = '';
     $charset = 'utf8mb4';
     $dsn = "mysql:host=$hostName; dbname=$dbName; charset=$charset";
     $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
     ];

	/** to test if the DB exists
	 * @return bool
	 */
	function testDatabase (): bool
	{
		$hostName = 'localhost';
		//$dbName = 'optimizer';
		$charset = 'utf8mb4';
		$options = [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC];
		try {
			$dsn = "mysql:host=$hostName; 'optimizer' ; charset=$charset";
			$pdo = new PDO($dsn,'root', '', $options);
			$query = $pdo->query("SHOW DATABASES LIKE 'optimizer'");
			$results = $query->fetch();

			if ($results) {
				return true;
			} else {
				response(404);
				return false;
			}
		} catch (PDOException $e) {
			response(500, $e->getMessage());
			return false;
		}
	}

	/** create the 'optimizer' DB
	 * @param string           $hostName
	 * @param string           $charset
	 * @param string           $userName
	 * @param string           $password
	 * @param array            $options
	 *
	 * @return PDO|false
	 */
	function createNewDB(
		string $hostName = 'localhost',
		string $charset = 'utf8mb4',
		string $userName = 'root',
		string $password = '',
		array $options = [
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
	): PDO|false
	{
		$dsn = "mysql:host=$hostName; 'optimizer' ; charset=$charset";
		try {
			$dbPDO = new PDO($dsn, $userName, $password, $options);
			$sql = "CREATE DATABASE IF NOT EXISTS `optimizer`";

			$pdoStatement = $dbPDO->prepare($sql);
			$pdoStatement->execute();
			return $dbPDO;
		} catch (PDOException $e) {
			response(500, $e->getMessage());
			return false;
		}
	}

	function response ($errornr, $errormsg = ''): void
	{
		$response = new SimpleXMLElement('<response/>');
		$response->addChild('status', $errornr);
		if ($errornr == 500) {
			$response->addChild('message', $errormsg);
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