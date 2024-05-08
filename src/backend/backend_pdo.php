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
        echo 'FEHLER beim Verbindungsaufbau:<br>' . $e->getMessage() . '';
    }

    $lookingForID = 53;
    $newDescription = "Dont say anything.. I already know!";

    $ID = '';
    $taskID = 1;
    $title = 'Title of this Todo!';
    $status = 1;
    $description = "This could be advertisement!";
    $lastUpdate = "reformat the function an the usability";

//      createTodo($ID, $taskID, $title, $status, $description, $lastUpdate, $dbObj);
//      updateTodo($lookingForID, $newDescription, $dbObj);
//      deleteTodo($lookingForID, $dbObj);
//      readTodo($status, $dbObj);

/**
 * RESTversuch für createTodo
 * TODO: testen! / modifizieren!
 */
$app->post('/todo', function ($request, $response) use ($dbObj) {
    $xml = simplexml_load_string($request->getBody());
    $data = (array)$xml;

    $ID = $data['ID'];
    $title = $data['title'];
    $status = $data['status'];
    $description = $data['description'];
    $lastUpdate = $data['lastUpdate'];

    createTodo($ID, null, $title, $status, $description, $lastUpdate, $dbObj);

    // Prüfen, ob Tasks vorhanden sind
    if (isset($data['task'])) {
        foreach ($data['task'] as $task) {
            $task = (array)$task;
            $taskID = $task['taskID'];
            $taskTitle = $task['title'];
            $taskStatus = $task['status'];
            $taskDescription = $task['description'];
            $taskLastUpdate = $task['lastUpdate'];

            createTodo($ID, $taskID, $taskTitle, $taskStatus, $taskDescription, $taskLastUpdate, $dbObj);
        }
    }

    return $response->withStatus(200);
});





    /**
     * insert (PDO)
     * assoc in values
     */
    function createTodo($ID, $taskID, $title, $status, $description, $lastUpdate, $dbObj)
    {
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
        } catch (PDOException $e) {
            echo 'Der INSERT hat nicht geklappt:<br>' . $e->getMessage() . '';
        }
    }

    /**
     * read (select) (POD)
     * assoc in rows
     */
    function readTodo($status, $dbObj)
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $readTodo = 'SELECT * FROM todotable WHERE status = :statusValue';         //suche nach gelöschten Todos (status = 5)

            $stmt = $dbObj->prepare($readTodo);
            $stmt->execute(['statusValue' => $status]);


            //echo gettype($stmt);
            //echo $stmt;

            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                //print_r($row);
                echo '<br>';
                print_r('ID: ' . $row['ID']);
                echo '<br>';
                print_r('Titel: ' . $row['title']);
                echo '<br>';
                print_r('Status: ' . $row['status']);
            }
        } catch (PDOException $e) {
            echo 'READ hat nicht geklappt:<br>' . $e->getMessage() . '';
        }
    }
    /**
     * update (PDO)
     */
    function updateTodo($ID, $description, $dbObj)
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $updateTodo = 'UPDATE todotable
                            SET description = :descriptionValue
                            WHERE ID = :IDValue';
            $stmt = $dbObj->prepare($updateTodo);
            $stmt->execute([
                'IDValue' => $ID,
                'descriptionValue' => $description
            ]);
            echo 'UPDATE hat: ' . $stmt->rowCount() . ' Zeilen geändert. <br>';
        } catch (PDOException $e) {
            echo 'Das UPDATE hat nicht geklappt:<br>' . $e->getMessage() . '';
        }
    }

    /**
     * delete
     */
    function deleteTodo($ID, $dbObj)
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $delteTodo = 'DELETE FROM todotable
            WHERE ID = :IDValue';
            $stmt = $dbObj->prepare($delteTodo);
            $stmt->execute(['IDValue' => $ID]);
            echo 'DELETE hat ' . $stmt->rowCount() . ' Zeilen gelöscht. <br>';
        } catch (PDOException $e) {
            echo 'DELETE hat nicht geklappt:<br>' . $e->getMessage() . '';
        }
    }
    ?>

</body>

</html>