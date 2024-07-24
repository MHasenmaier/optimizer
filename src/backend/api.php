<?php

    //maybe not necessary
    use Random\RandomException;

    include 'dbserver.php';

    //TESTDATA
    //to be replaced when API and frontend are working
    $todoDataArray = array(
        'ID' => 36,
        'taskID' => '[1,2,3,5,10,221]',
        'title' => 'some new title',
        'status' => 9,
        'description' => 'some new shit. you know. lot to do. more stuff than usually. some easy stuff. some hard stuff. but always stuff. a lot. i mean, really, a lot of stuff.',
        'lastUpdate' => 'add some tasks'
    );

    //TESTDATA
    //to be replaced when API and frontend are working
    $newTodoDataArray = array(
        'taskID' => '[6,9,31,52,106,221]',
        'title' => 'new title for new todo',

        'description' => 'new todo. new description.',
        'lastUpdate' => ''
    );


    //getAllTodosByStatus(2, $dbObj);  // change "2" to generic integer variable

	//echo json_encode(getAllActiveTodos($dbObj));
    //var_dump(getAllActiveTodos($dbObj));

    //echo json_encode(getAllTodos());
    //var_dump(getAllTodos());

    //echo json_encode(getTodoById($todoDataArray, $dbObj), JSON_PRETTY_PRINT);
    //deleteTodo($todoDataArray, $dbObj);

    /**
 * create function
 * assoc in values
 * if status != number 1-5, staus = 2 by default
 * @param array $inputTodoData
 * @param $dbObj -database object
 * @return string|false -if successful returns the created todo as json modified string
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

            return json_encode($dbObj->query("SELECT * FROM todotable LIMIT " . (countData($dbObj) - 1) . ", 1")->fetchAll(PDO::FETCH_ASSOC));
         } catch (PDOException $e) {
            echo 'Der createTodo hat nicht geklappt:<br>' . $e->getMessage();
            return false;
        }
    }

	/**
	 * Returns JSON with all todos
	 * @return array|false
	 */
    function getAllTodos(): array|false
    {
		global $dbPDO;

      try {
		  $collectAllTodo = "SELECT * FROM todotable";

          $stmt = $dbPDO->prepare($collectAllTodo);
          $stmt->execute();

	      //TODO: de-comment
	      //header('Content-Type: application/json');

          return $stmt->fetchAll(PDO::FETCH_ASSOC);

      } catch (PDOException $e) {
	      //TODO: de-comment
	      //header('Content-Type: application/json');
          echo 'Der getAllTodo hat nicht geklappt:<br>' . $e->getMessage();
		  echo json_encode(['error' => $e->getMessage()]);
          return false;
      }
  }

	/**
	 * Returns JSON with all todos  with status != 5
	 * @return array|false
	 */
	function getAllActiveTodos(): array|false
	{
		global $dbPDO;

		try {
			$sqlSelectAllActiveTodos = 'SELECT * FROM todotable WHERE status != 5';

			$getAllActiveTodos = $dbPDO->prepare($sqlSelectAllActiveTodos);
			$getAllActiveTodos->execute();

			return $getAllActiveTodos->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			echo 'getTodoByStatus hat nicht geklappt:
			' . $e->getMessage();
			return false;
		}
	}

	/**
	 * Returns JSON with all todos with status == 5
	 * @return array|false
	 */
	function getAllInactiveTodos(): array|false
	{
		global $dbPDO;

		try {
			$selectAllInactiveTodos = 'SELECT * FROM todotable WHERE status = 5';

			$stmt = $dbPDO->prepare($selectAllInactiveTodos);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			echo 'getTodoByStatus hat nicht geklappt:<br>' . $e->getMessage();
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
 * read function (select)
 * assoc in rows
 * @param $todoDataArray - array of the todo
 * @param $dbObj - database object
 * @return object|false
 */
    function getTodoById(int $id): array|false
    {
		global $dbPDO;

        try {
            $sqlSelectTodoByID = 'SELECT * FROM todotable WHERE ID = :IDValue';

            $expectedTodoById = $dbPDO->prepare($sqlSelectTodoByID);
            $expectedTodoById->execute(['IDValue' => $id]);

			$checkedIDTodo = ($expectedTodoById->fetchAll(PDO::FETCH_ASSOC))[0];

	        //check if
	        if (!empty($checkedIDTodo))
	        {
				return false;
			}
            return $checkedIDTodo;
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
            $row = $stmt->fetchAll();
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
        //set default status = 2 if not 1-5
        is_null($statusInput) ? 2 : $statusInput;
        return (($statusInput !== (1 || 2 || 3 || 4 || 5)) ? 2 : $statusInput);
    }

    /**
     * @param int $id - ID to look for
     * @param $dbObj
     * @return array|false - returns the array of the questionable todo
     */
    function checkID (int $id): array|false
    {
           $allTodosArray = getAllTodos();

           foreach ($allTodosArray as $todo) {
               if ($id == $todo['ID']) {
                   return $todo;
               }
           }
        return false;
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