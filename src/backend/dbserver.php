<?php

/**
 *
 */

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


    /**
     * starts the server and tries to connect to the mysql db
     * @return PDO|false
     */
        try {
	        $dbPDO = new PDO($dsn, $userName, $password, $options);
        } catch (PDOException $e) {
            echo 'Unable to connect to database: ' . $e->getMessage();
	        //activate if needed
			//throw $e;
            return false;
        }