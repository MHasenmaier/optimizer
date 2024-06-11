<?php

//maybe not necessary
use Random\RandomException;

include 'Todo.php';
include 'Server.php';

    //to be replaced when API and frontend are working
    $todoDataArray = array(
        'ID' => 52,
        'taskID' => '',
        'title' => 'some new title',
        'status' => 9,
        'description' => 'some new shit. you know. lot to do. more stuff than usually. some easy stuff. some hard stuff. but always stuff. a lot. i mean, really, a lot of stuff.',
        'lastUpdate' => 'set up todo'
    );

    try {
        $server = new Server();
        $dbObj = $server->startServer();
        echo 'Verbinung aufgebaut
         ';
    } catch (PDOException $e) {
        echo 'FEHLER beim Verbindungsaufbau:
        ' . $e->getMessage();
    }

    //maybe not necessary when API and frontend are working
    $neuesTodo = new Todo($todoDataArray['title']);
    var_dump($neuesTodo);

    //createTodo($todoDataArray, $dbObj);
    //getAllTodosByStatus(2, $dbObj);  // change "2" to generic integer variable
    //updateTodo($todoDataArray, $dbObj);
    //deleteTodo($todoDataArray, $dbObj);
    //getAllTodos($dbObj);


    /**
 * create function
 * assoc in values
 * if status != number 1-5, staus = 2 by default
 * @param $todoData - properties for new todo item
 * @param $dbObj - database object
 * @return object|false
 */
    function createTodo($todoData, $dbObj): object|false
    {
        // check if status is valid
        $todoData['status'] = statusCheck($todoData['status']);

        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $insertTodo = "INSERT INTO todotable
                           (ID, taskID, title, status, description, lastUpdate)
                           VALUES (:ID, :taskID, :title, :status, :description, :lastUpdate)";
            $stmt = $dbObj->prepare($insertTodo);
            $stmt->execute([
                'ID' => $todoData['ID'],
                'taskID' => $todoData['taskID'],
                'title' => $todoData['title'],
                'status' => $todoData['status'],
                'description' => $todoData['description'],
                'lastUpdate' => $todoData['lastUpdate']
            ]);

            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
            return $stmt;
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
    function getAllTodos($dbObj): object|false
    {
      try {
          $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

          header('Content-Type: application/json');

          $collectAllTodo = "SELECT * FROM todotable";

          $stmt = $dbObj->prepare($collectAllTodo);
          $stmt->execute();

          echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);
          return $stmt;

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
    function getAllTodosByStatus(int $status, $dbObj): object|false
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $getAllTodosByStatus = 'SELECT * FROM todotable WHERE status = :statusValue';
    
            $stmt = $dbObj->prepare($getAllTodosByStatus);
            $stmt->execute(['statusValue' => $status]);

            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);

            return $stmt;
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
    function getTodoById($todoDataArray, $dbObj): object|false
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $selectTodoByID = 'SELECT * FROM todotable WHERE id = :IDValue';

            $stmt = $dbObj->prepare($selectTodoByID);
            $stmt->execute(['IDValue' => $todoDataArray['ID']]);

            header('Content-Type: application/json');

            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC),JSON_PRETTY_PRINT);
            return $stmt;
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
    function updateTodo($todoDataArray, $dbObj): object|false
    {
        try {
            $dbObj->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $updateTodo = "UPDATE todotable
               SET taskID = :taskID,
                   title = :title,
                   status = :status,
                   description = :description,
                   lastUpdate = :lastUpdate
               WHERE ID = :ID";

            // check if status is valid
            $todoDataArray['status'] = statusCheck($todoDataArray['status']);


            $stmt = $dbObj->prepare($updateTodo);
            $stmt->execute([
                'ID' => $todoDataArray['ID'],
                'taskID' => $todoDataArray['taskID'],
                'title' => $todoDataArray['title'],
                'status' => $todoDataArray['status'],
                'description' => $todoDataArray['description'],
                'lastUpdate' => $todoDataArray['lastUpdate']
            ]);

            echo "$-stmt = " . json_encode($stmt->fetchAll(PDO::FETCH_ASSOC),JSON_PRETTY_PRINT) . "
            ";
            echo "$-todoUpdateData = " .  json_encode($todoDataArray,JSON_PRETTY_PRINT) . "
            ";
            return $stmt;
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
    function statusCheck (int $statusInput): int
    {
        //set default status = 2
        return (($statusInput !== (1 || 2 || 3 || 4 || 5)) ? 2 : $statusInput);
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
 * default is missing
 * functions are missing
 * return is missing (necessary?)
 * parameter possibly wrong / not complete
 *
 * @param $todoDataArray - todo as an array
 * @param $dbObj
 * @return void
 */
    function routing ($todoDataArray, $dbObj) :void
    {
        $id = $todoDataArray['ID'];
        $status = $todoDataArray['status'];

        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':
                if ($_SERVER['REQUEST_URI'] == '/api/todos') {
                    getAllTodos($dbObj);
                } elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
                    getTodoById($id, $dbObj);
                } elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $status) {
                    getAllTodosByStatus($status, $dbObj);
                }
                // function for "get all todos status 1-4", so that the deleted ones are excluded, still missing

                break;
            case 'POST':
                if ($_SERVER['REQUEST_URI'] == '/api/todos'){
                    createTodo($todoDataArray, $dbObj);
                } elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
                    updateTodo($todoDataArray, $dbObj);
                }
                break;
            case 'DELETE':
                if ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
                    deleteTodo($todoDataArray, $dbObj);
                }
            //PUT

            default:
                echo 'routing-switch-case im default:
                $_SERVER["REQUEST_METHOD"]: ' . var_dump($_SERVER['REQUEST_METHOD'] . '
                $todoDataArray: ' . var_dump($todoDataArray) . '
                $dbObj: ' . var_dump($dbObj));
        }
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
     * Validate todo data
     * @param $todoData - data for new todo item
     * @return array|bool - returns true if valid or an array of errors
     */
    function validateTodoData($todoData): bool|array
    {
        $errors = [];

        if (empty($todoData['title'])) {
            $errors['title'] = 'Titel ist erforderlich.';
        }

        if (!isset($todoData['due_date']) || strtotime($todoData['due_date']) === false) {
            $errors['due_date'] = 'Fälligkeitsdatum ist ungültig oder nicht gesetzt.';
        }

        // Weitere Validierungen können hier hinzugefügt werden

        return empty($errors) ? true : $errors;
    }

    /**
     * Error handling function
     * @param $exception - caught exception
     * @param $response - outgoing response
     * @return mixed
     */
    function errorHandler($exception, $response): mixed
    {
        // Protokollieren des Fehlers für die Server-Logs
        error_log($exception->getMessage());

        // Erstellen einer Fehlerantwort für den Client
        $errorResponse = [
            'error' => [
                'message' => 'Ein interner Fehler ist aufgetreten.',
                'code' => $exception->getCode()
            ]
        ];

        // Senden einer JSON-Antwort mit dem Fehlerstatus
        return $response->withStatus(500)->withJson($errorResponse);
    }

    /**
     * Datenformatierung zu XML
     * @param array $todos - Array von Todos
     * @return string - XML formatierte Todos
     */
    function formatTodosToXml(array $todos): string
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