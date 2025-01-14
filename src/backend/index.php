<?php
include("server.php");
include("routing.php");

//	//login-credentials and properties for DB
//	$hostName = 'localhost';
//	$dbName = 'optimizer';
//	$userName = 'root';
//	$password = '';
//	$charset = 'utf8mb4';
//	$dsn = "mysql:host=$hostName;dbname=$dbName;charset=$charset";
//	$options = [
//		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
//		PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
//	];


	//start routing
	if(!routing())
	{
		errormessage(500);
	}