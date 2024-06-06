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

    $lookingForID = 36;
    $newDescription = "Dont say anything.. I already know!";

    $ID = '';
    $taskID = '';
    $title = 'Title of this Todo!';
    $status = '';
    $description = "This could be an advertisement!";
    $lastUpdate = "JS takes care of update description";

    //var_dump($_SERVER["REQUEST_URI"]);

//    createTodo($ID, $taskID, $title, $status, $description, $lastUpdate, $dbObj);
//    readStatusTodo($status, $dbObj);

//    updateTodo($lookingForID, $newDescription, $dbObj);
//    deleteTodo($lookingForID, $dbObj);

    if (!readIDTodo($lookingForID, $dbObj)) {
      echo 'readIDTodo funktioniert NICHT!!';
  }

    /**
     * create function (alternate)
     * assoc in values
     * if status != number 1-5, staus = 2 by default
     * @param $ID
     * @param $taskID
     * @param $title
     * @param $status
     * @param $description
     * @param $lastUpdate
     * @param $dbObj - database object
     * @return bool
     */
    function altCreateTodo($ID, $taskID, $title, $status, $description, $lastUpdate, $dbObj): bool
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
   *  create function
   *  assoc in values
   * if status != number 1-5, staus = 2 by default
   * @param $todoData - properties for new todo item
   * @param $dbObj - database object
   * @return bool
   */
    function createTodo($todoData, $dbObj): bool
    {
        // set status = 2 as default
        if ($todoData['status'] !== (1 || 2 || 3 || 4 || 5))
        {
            $todoData['status'] = 2;
        }

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

            echo 'INSERT hat: ' . $stmt->rowCount() . ' Zeilen geändert.<br>';
            echo 'INSERT hat ein Todo mit folgenden Werten erstellt:<br>
                    ID: ' . $todoData['ID'] . '<br>
                    Task ID: ' . $todoData['taskID'] . '<br>
                    Titel: ' . $todoData['title'] . '<br>
                    Status: ' . $todoData['status'] . '<br
                    Beschreibung: ' . $todoData['description'] . '<br>';
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

            header('Content-Type: application/json');

            echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC),JSON_PRETTY_PRINT);

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
            return $row['dbSize'];
        } catch (PDOException $e) {
            echo 'countData hat nicht geklappt:<br>' . $e->getMessage();
            return -1;
        }
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
   * routing function with switch-case for different use of an url
   * PUT and DELETE are still missing
   * default is missing
   * functions are missing
   * return is mission (necessary?)
   * parameter possibly wrong / not complete
   *
   * @param $id
   * @return void
   */
  function routing ($id) :void
  {
      switch ($_SERVER['REQUEST_METHOD']) {
          case 'GET':
              if ($_SERVER['REQUEST_URI'] == '/api/todos') {
//                  getAllTodos();
              } elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
                  getTodoById($id);
              }
              break;
          case 'POST':
              if ($_SERVER['REQUEST_URI'] == '/api/todos'){
//                  createTodo($todoData, $dbObj);
              }
              break;
          //PUT

          //DELETE

          //default
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
          echo 'Authentifizierung fehlgeschlagen:<br>' . $e->getMessage();
          return false;
      }
  }

  /**
   * Generate a token for a user
   * @param $userId - User's ID
   * @return string
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


  ?>