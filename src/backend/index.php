<?php
include("dbserver.php");
include("routing.php");

//login-credentials and properties for DB
	$hostName = 'localhost';
	$dbName = 'optimizer';
	$userName = 'root';
	$password = '';
	$charset = 'utf8mb4';
	$dsn = "mysql:host=$hostName;dbname=$dbName;charset=$charset";
	$options = [
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
	];

	global $dbPDO;

	//start routing
	if(!routing($dbPDO))
	{
		errormessage(500);
	}