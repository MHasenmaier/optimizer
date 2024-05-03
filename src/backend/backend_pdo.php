<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>backend_pdo</title>
</head>
<body>
    
    <?php
    /**
     * initialize connection to db
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
         * connect to db
         */
        try {
            $dbObj = new PDO ($dsn, $userName, $password, $options);
        } catch (PDOException $e) {
            echo 'FEHLER beim Verbindungsaufbau: '. $e->getMessage () .'';
        }

        /**
         * insert
         */
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $insertTodo = 'INSERT INTO todotable
                    (ID, taskID, title, status, description, createDate, updateDate, lastUpdate)
                    VALUES ("", 1, "todo1", 3, "beschreibung todo1", 2023-12-01, 2024-05-03, "kein update")';
            $betroffeneZeilen = $dbObj->exec($insertTodo);
            echo $betroffeneZeilen . ' wurden geändert.';
            } catch (PDOException $e) {
                echo 'Der INSERT hat nicht geklappt: '. $e->getMessage () .'';
        }

        /**
         * update
         */
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $updateTodo = 'UPDATE todotable
                            SET description = "geile Beschreibung!"
                            WHERE ID = 36';
            $aktualisierteZeilen = $dbObj->exec($updateTodo);
            echo $aktualisierteZeilen . ' wurden geändert';
            } catch (PDOException $e) {
                echo 'Das UPDATE hat nicht geklappt: '. $e->getMessage () .'';
        }

        /**
         * delete
         */
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $delteTodo = 'DELETE FROM todotable
            WHERE ID = 40';
            $gelöschteZeilen = $dbObj->exec($delteTodo);
            echo $gelöschteZeilen . ' wurden gelöscht.';
        } catch (PDOException $e) {
            echo 'DELETE hat nicht geklappt: '. $e->getMessage () .'';
        }
        
    ?>

</body>
</html>