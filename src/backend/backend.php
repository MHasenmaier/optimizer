<?php

//maybe not necessary
use Random\RandomException;

include 'Todo.php';
include 'Server.php';

    //to be replaced when API and frontend are working
    $todoDataArray = array(
        'ID' => 36,
        'taskID' => '[1,2,3,5,10,221]',
        'title' => 'some new title',
        'status' => 9,
        'description' => 'some new shit. you know. lot to do. more stuff than usually. some easy stuff. some hard stuff. but always stuff. a lot. i mean, really, a lot of stuff.',
        'lastUpdate' => 'add some tasks'
    );

    //to be replaced when API and frontend are working
    $newTodoDataArray = array(
        'taskID' => '[6,9,31,52,106,221]',
        'title' => 'new title for new todo',

        'description' => 'new todo. new description.',
        'lastUpdate' => ''
    );

    try {
        $server = new Server();
        $dbObj = $server->startServer();
        echo 'Verbinung zum Server wurde erfolgreich aufgebaut
         
         ';
    } catch (PDOException $e) {
        echo '!!!!!!!!!!!!!
        FEHLER beim Verbindungsaufbau:
        ' . $e->getMessage() . '
        !!!!!!!!!!!!!';
    }

    //getAllTodosByStatus(2, $dbObj);  // change "2" to generic integer variable
    echo json_encode(getAllActiveTodos($dbObj));
    var_dump(getAllActiveTodos($dbObj));
    //echo json_encode(getTodoById($todoDataArray, $dbObj), JSON_PRETTY_PRINT);
    //deleteTodo($todoDataArray, $dbObj);

    /**
 * create function
 * assoc in values
 * if status != number 1-5, staus = 2 by default
 * @param array $inputTodoData
 * @param $dbObj - database object
 * @return string|false - if successful returns the created todo as json modified string
 */
    function createTodo(array $inputTodoData, $dbObj): string|false
    {
        // check if status exists ant is valid
        if (array_key_exists('status', $inputTodoData))
        {
            $inputTodoData['status'] = statusCheck($inputTodoData['status']);
        } else {
            //set status = 2 as default
            $inputTodoData['status'] = 2;
        }


        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $insertTodo = "INSERT INTO todotable
                           (taskID, title, status, description, lastUpdate)
                           VALUES (:taskID, :title, :status, :description, :lastUpdate)";
            $createdTodo = $dbObj->prepare($insertTodo);
            $createdTodo->execute([
                'taskID' => $inputTodoData['taskID'],
                'title' => $inputTodoData['title'],
                'status' => $inputTodoData['status'],
                'description' => $inputTodoData['description'],
                'lastUpdate' => $inputTodoData['lastUpdate']
            ]);

            return json_encode($dbObj->query("SELECT * FROM todotable LIMIT " . (countData($dbObj) - 1) . ", 1")->fetch(PDO::FETCH_ASSOC));
         } catch (PDOException $e) {
            echo 'Der createTodo hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
   * get function
   * assoc of all todos
   * @param $dbObj
   * @return object|false
   */
    function getAllTodos($dbObj): array|false
    {
      try {
          $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

          //TODO: delete the comment
          //header('Content-Type: application/json');

          $collectAllTodo = "SELECT * FROM todotable";

          $stmt = $dbObj->prepare($collectAllTodo);
          $stmt->execute();


          //debugging console out
          //echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
          return $stmt->fetchAll(PDO::FETCH_ASSOC);

      } catch (PDOException $e) {
          echo 'Der getAllTodo hat nicht geklappt:<br>' . $e->getMessage();
          return false;
      }
  }

    /**
     * read function (select) - is important for the archiv and the bin
     * assoc in rows
     * @param $status
     * @param $dbObj - database object
     * @return object|false
     */
    function getAllTodosByStatus(int $inputStatus, $dbObj): array|false
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $selectAllTodosByStatus = 'SELECT * FROM todotable WHERE status = :statusValue';

            $expectedTodoByStatus = $dbObj->prepare($selectAllTodosByStatus);
            $expectedTodoByStatus->execute(['statusValue' => $inputStatus]);

            echo json_encode($expectedTodoByStatus->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);

            return ($expectedTodoByStatus->fetchAll(PDO::FETCH_ASSOC));
        } catch (PDOException $e) {
            echo 'getTodoByStatus hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
     * function for all todos status != 5
     * @param $dbObj
     * @return array|false - returns all active todos as an array
     */
    function getAllActiveTodos($dbObj): array|false
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $selectAllActiveTodos = 'SELECT * FROM todotable WHERE status != 5';

            $allActiveTodos = $dbObj->query($selectAllActiveTodos)->fetchAll(PDO::FETCH_ASSOC);

            return $allActiveTodos;
        } catch (PDOException $e) {
            echo 'getTodoByStatus hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
 * read function (select)
 * assoc in rows
 * @param $todoDataArray - array of the todo
 * @param $dbObj - database object
 * @return object|false
 */
    function getTodoById(array $inputTodoDataArray, $dbObj): array|false
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $sqlSelectTodoByID = 'SELECT * FROM todotable WHERE id = :IDValue';

            $expectedTodoById = $dbObj->prepare($sqlSelectTodoByID);
            $expectedTodoById->execute(['IDValue' => $inputTodoDataArray['ID']]);

            //TODO de-comment this line!
            //header('Content-Type: application/json');

            return ($expectedTodoById->fetchAll(PDO::FETCH_ASSOC))[0];
        } catch (PDOException $e) {
            echo 'getTodoById hat nicht geklappt:
            ' . $e->getMessage();
            return false;
        }
    }

    /**
 * update function
 * does not take care about form validation
 * @param $todoDataArray - todo as an array
 * @param $dbObj - database object
 * @return object|false
 */
    function updateTodo(array $inputTodoDataArray, $dbObj): array|false
    {
        //soll bei ungültiger ID den return auslösen
        if (!($inputTodoDataArray['ID'] > 0))
        {
            echo "Ungültige ID: " . $inputTodoDataArray['ID'] . " in updateTodo.";
            return false;
        }

        try {
            $updateTodo = "UPDATE todotable
                            SET taskID = :taskID,
                                title = :title,
                                status = :status,
                                description = :description,
                                lastUpdate = :lastUpdate
                            WHERE ID = :ID";

            // check if status is valid
            $inputTodoDataArray['status'] = statusCheck($inputTodoDataArray['status']);

            $prepUpdatedTodo = $dbObj->prepare($updateTodo);
            $prepUpdatedTodo->execute([
                'ID' => $inputTodoDataArray['ID'],
                'taskID' => $inputTodoDataArray['taskID'],
                'title' => $inputTodoDataArray['title'],
                'status' => $inputTodoDataArray['status'],
                'description' => $inputTodoDataArray['description'],
                'lastUpdate' => $inputTodoDataArray['lastUpdate']
            ]);

            return getTodoById($inputTodoDataArray, $dbObj);
        } catch (PDOException $e) {
            echo 'Das updateTodo hat nicht geklappt:
            ' . $e->getMessage();
            return false;
        }
    }

    /**
 * delete function
 * @param $todoDataArray - todo as an array
 * @param $dbObj - database object
 * @return bool
 */
    function deleteTodo($todoDataArray, $dbObj): bool
    {
        //temp variable for debugging echo
        $tempID = $todoDataArray['ID'];
        try {
            $deleteTodo = 'DELETE FROM todotable
            WHERE ID = :IDValue';
            $stmt = $dbObj->prepare($deleteTodo);
            $stmt->execute(['IDValue' => $todoDataArray['ID']]);
            echo 'DELETE hat ' . $stmt->rowCount() . ' Zeilen gelöscht. <br>';
            echo 'DELETE hat den Eintrag mit der ID: ' . $tempID . ' endgültig gelöscht.';
            return true;
        } catch (PDOException $e) {
            echo 'DELETE hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
 * function to figure out, how many data is stored in the db
 * @param $dbObj
 * @return int|false - number of rows/data in the db
 * @return false if not successful
 */
    function countData($dbObj): int|false
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $stmt = $dbObj->prepare('SELECT COUNT(*) as dbSize FROM todotable');
            $stmt->execute();
            $row = $stmt->fetch();
            return $row['dbSize'];
        } catch (PDOException $e) {
            echo 'countData hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

    /**
 * checks the status has a valid form and set 2 as default if not
 * @param $statusInput - status as integer
 * @return int - status value, by default 2 if status was not 1, 2, 3, 4, or 5
 */
    function statusCheck ($statusInput): int
    {
        is_null($statusInput) ? 2 : $statusInput;
        //set default status = 2 if not 1-5
        return (($statusInput !== (1 || 2 || 3 || 4 || 5)) ? 2 : $statusInput);
    }

    /**
     * @param int $id - ID to look for
     * @param $dbObj
     * @return array|false - returns the array of the questionable todo
     */
    function checkID (int $id, $dbObj): array|false
    {
           $allTodosArray = getAllTodos($dbObj);

           foreach ($allTodosArray as $todo) {
               if ($id == $todo['ID']) {
                   return $todo;
               }
           }
        return false;
    }

/**
     * Potenzielle Funktionen für
     * Routing
     * Middleware
     * Authentifizierung
     * Validierungsfunktion
     * Fehlerbehebung
     * Datenformatierung
     */

    /**
 * routing function with switch-case for $_SERVER['REQUEST_METHOD']
 * PUT is still missing
 * parameter possibly wrong / not complete
 *
 * @param $todoDataArray - todo as an array
 * @param $dbObj
 * @return bool - true if routing was successful
     */
    function routing ($todoDataArray, $dbObj) : bool
    {
        $id = $todoDataArray['ID'];
        $status = $todoDataArray['status'];

        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                if ($_SERVER['REQUEST_URI'] == '/api/todos') {
                    getAllActiveTodos($dbObj);
                    return true;
                } elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
                    getTodoById($id, $dbObj);
                    return true;
                } elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $status) {
                    getAllTodosByStatus($status, $dbObj);
                    return true;
                }

                break;
            case 'POST':
                if ($_SERVER['REQUEST_URI'] == '/api/todos'){
                    createTodo($todoDataArray, $dbObj);
                    return true;
                } elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
                    updateTodo($todoDataArray, $dbObj);
                    return true;
                }
                break;
            case 'DELETE':
                if ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
                    deleteTodo($todoDataArray, $dbObj);
                    return true;
                }
            //PUT

            default:
                echo 'routing-switch-case im default:
                $_SERVER["REQUEST_METHOD"]: ' . var_dump($_SERVER['REQUEST_METHOD'] . '
                $todoDataArray: ' . var_dump($todoDataArray) . '
                $dbObj: ' . var_dump($dbObj));
        }
        return false;
    }

    /**
     * Authentication middleware
     * @param $request - incoming request
     * @param $response - outgoing response
     * @param $next - next middleware or controller
     * @return mixed
     */
    function authMiddleware($request, $response, $next): mixed
    {
        // Überprüfen, ob ein Authentifizierungstoken vorhanden ist
        $authHeader = $request->getHeader('Authorization');
        $token = $authHeader ? $authHeader[0] : null;

        if (validateToken($token)) {
            // Wenn das Token gültig ist, fahre mit der nächsten Middleware oder dem Controller fort
            return $next($request, $response);
        } else {
            // Wenn das Token ungültig ist, gib einen Fehler zurück
            return $response->withStatus(401)->withJson(['error' => 'Unauthorized']);
        }
    }

    /**
     * Token validation function
     * @param $token - authentication token
     * @return bool
     */
    function validateToken($token): bool
    {
        // Hier würde die Logik zur Überprüfung des Tokens stehen.
        // Zum Beispiel könnte hier eine Datenbankabfrage stattfinden
        return $token === 'valid-token'; // Vereinfachtes Beispiel
    }

    /**
     * Authenticate user and return token
     * @param $username - User's username
     * @param $password - User's password
     * @param $dbObj - database object
     * @return string|false
     */
    function authenticateUser($username, $password, $dbObj): false|string
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $query = 'SELECT * FROM users WHERE username = :username';

            $stmt = $dbObj->prepare($query);
            $stmt->execute(['username' => $username]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                // Hier würde ein Token generiert und zurückgegeben werden
                return generateToken($user['id']);
            } else {
                return false;
            }
        } catch (PDOException $e) {
            echo 'Authentifizierung fehlgeschlagen (PDOException):
            ' . $e->getMessage();
            return false;
        } catch (RandomException $e) {
            echo 'Authentifizierung im generateToken fehlgeschlagen (RandomException):
            ' . $e->getMessage();
            return false;
        }
    }

    /**
 * Generate a token for a user
 * @param $userId - User's ID
 * @return string
 * @throws RandomException
 */
    function generateToken($userId): string
    {
        // Hier würde ein sicheres Token generiert werden.
        // Dies ist nur ein vereinfachtes Beispiel
        return base64_encode(random_bytes(32)) . '.' . $userId;
    }

    /**
     * Datenformatierung zu XML
     * @param array $todos - Array von Todos
     * @return string - XML formatierte Todos
     */
    function formatTodosToXml($todos): string
    {
        $xml = new SimpleXMLElement('<todos/>');

        foreach ($todos as $todo) {
            $todoElement = $xml->addChild('todo');
            foreach ($todo as $key => $value) {
                $todoElement->addChild($key, htmlspecialchars($value));
            }
        }

        header('Content-Type: application/xml');
        return $xml->asXML();
    }