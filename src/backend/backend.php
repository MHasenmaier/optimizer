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
        $dbObj = new PDO($dsn, $userName, $password, $options);
    } catch (PDOException $e) {
        echo 'FEHLER beim Verbindungsaufbau:<br>' . $e->getMessage();
    }

    $lookingForID = 59;
    $newDescription = "Dont say anything.. I already know!";

    $ID = '';
    $taskID = '';
    $title = 'Title of this Todo!';
    $status = '';
    $description = "This could be an advertisement!";
    $lastUpdate = "JS takes care of update description";

//    createTodo($ID, $taskID, $title, $status, $description, $lastUpdate, $dbObj);
//    readStatusTodo($status, $dbObj);
    readIDTodo($lookingForID, $dbObj);
//    updateTodo($lookingForID, $newDescription, $dbObj);
//    deleteTodo($lookingForID, $dbObj);
      countData($dbObj);

    /**
     * create function
     * assoc in values
     * @param $ID
     * @param $taskID
     * @param $title
     * @param $status
     * @param $description
     * @param $lastUpdate
     * @param $dbObj - database object
     * @return bool
     */
    function createTodo($ID, $taskID, $title, $status, $description, $lastUpdate, $dbObj): bool
    {
        // set status = 2 as default
        if ($status !== (1 || 2 || 3 || 4 || 5))
        {
            $status = 2;
        }

        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $insertTodo = "INSERT INTO todotable
                           (ID, taskID, title, status, description, lastUpdate)
                           VALUES (:ID, :taskID, :title, :status, :description, :lastUpdate)";
            $stmt = $dbObj->prepare($insertTodo);
            $stmt->execute([
                'ID' => $ID,
                'taskID' => $taskID,
                'title' => $title,
                'status' => $status,
                'description' => $description,
                'lastUpdate' => $lastUpdate
            ]);

            echo 'INSERT hat: ' . $stmt->rowCount() . ' Zeilen geändert.<br>';
            echo 'INSERT hat ein Todo mit folgenden Werten erstellt:<br>
                    ID: ' . $ID . '<br>
                    Task ID: ' . $taskID . '<br>
                    Titel: ' . $title . '<br>
                    Status: ' . $status . '<br
                    Beschreibung: ' . $description . '<br>';
            return true;
         } catch (PDOException $e) {
            echo 'Der INSERT hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
     * read function (select) - is important for the archiv and the bin
     * assoc in rows
     * @param $status
     * @param $dbObj - database object
     * @return bool
     */
    function readStatusTodo($status, $dbObj): bool
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $readStatusTodo = 'SELECT * FROM todotable WHERE status = :statusValue';         //suche nach gelöschten Todos (status = 5)
    
            $stmt = $dbObj->prepare($readStatusTodo);
            $stmt->execute(['statusValue' => $status]);

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                print_r('ID: ' . $row['ID']);
                echo '<br>';
                print_r('Titel: ' . $row['title']);
                echo '<br>';
                print_r('Status: ' . $row['status']);
                echo '<br>';
            }
            return true;
        } catch (PDOException $e) {
            echo 'READ hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
     * read function (select)
     * assoc in rows
     * @param $ID
     * @param $dbObj - database object
     * @return bool
     */
    function readIDTodo($ID, $dbObj): bool
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $readIDTodo = 'SELECT * FROM todotable WHERE id = :IDValue';

            $stmt = $dbObj->prepare($readIDTodo);
            $stmt->execute(['IDValue' => $ID]);

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                print_r('ID: ' . $row['ID']);
                echo '<br>';
                print_r('Titel: ' . $row['title']);
                echo '<br>';
                print_r('Status: ' . $row['status']);
                echo '<br>';
            }
            return true;
        } catch (PDOException $e) {
            echo 'READ hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
     * update function
     * JS takes care about the content of each parameter
     * @param $ID
     * @param $taskID
     * @param $title
     * @param $status
     * @param $description
     * @param $lastUpdate
     * @param $dbObj - database object
     * @return bool
     */
    function updateTodo($ID, $taskID, $title, $status, $description, $lastUpdate, $dbObj): bool
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $updateTodo = "UPDATE todotable
                            (ID, taskID, title, status, description, lastUpdate)
                           VALUES (:ID, :taskID, :title, :status, :description, :lastUpdate)";
            $stmt = $dbObj->prepare($updateTodo);
            $stmt->execute([
                'ID' => $ID,
                'taskID' => $taskID,
                'title' => $title,
                'status' => $status,
                'description' => $description,
                'lastUpdate' => $lastUpdate
            ]);
            echo 'UPDATE hat: ' . $stmt->rowCount() . ' Zeilen geändert. <br>';
            echo 'UPDATE:<br>ID: ' . $ID . '<br>'
                . 'taskID: ' . $taskID . '<br>'
                . 'Titel: ' . $title . '<br>'
                . 'Status: ' . $status . '<br>'
                . 'Description: ' . $description . '<br>'
                . 'Last Update: ' . $lastUpdate;
            return true;
        } catch (PDOException $e) {
            echo 'Das UPDATE hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
     * delete function
     * @param $ID
     * @param $dbObj - database object
     * @return bool
     */
    function deleteTodo($ID, $dbObj): bool
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $deleteTodo = 'DELETE FROM todotable
            WHERE ID = :IDValue';
            $stmt = $dbObj->prepare($deleteTodo);
            $stmt->execute(['IDValue' => $ID]);
            echo 'DELETE hat ' . $stmt->rowCount() . ' Zeilen gelöscht. <br>';
            echo 'DELETE hat den Eintrag mit der ID: ' . $ID . ' endgültig gelöscht.';
            return true;
        } catch (PDOException $e) {
            echo 'DELETE hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
     * function to figure out, how many data is stored in the db
     * @param $dbObj
     * @return int - number of rows/data in the db
     * return -1 if function was not successfully
     */
    function countData($dbObj): int
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $stmt = $dbObj->prepare('SELECT COUNT(*) as dbSize FROM todotable');
            $stmt->execute();
            $row = $stmt->fetch();
            echo 'countData hat: ' . $row['dbSize'] . ' Einträge gefunden.';
            return $row['dbSize'];
        } catch (PDOException $e) {
            echo 'countData hat nicht geklappt:<br>' . $e->getMessage();
            return -1;
        }
    }
    
    ?>

</body>

</html>