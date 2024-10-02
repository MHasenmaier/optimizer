<?php
include 'dbserver.php';

	//getAllTodosByStatus(2);  // change "2" to generic integer variable

	//echo json_encode(getAllActiveTodos($dbObj));
	//var_dump(getAllActiveTodos($dbObj));

	//echo json_encode(getAllActiveTodos());
	//var_dump(getAllTodos());

	//echo json_encode(getTodoById($todoDataArray, $dbObj), JSON_PRETTY_PRINT);
	//deleteTodo($todoDataArray, $dbObj);

	/**
	 * create function
	 * assoc in values
	 * if status != number 1-5, staus = 2 by default
	 *
	 * @param array $inputTodoData
	 *
	 * @return string|false -if successful returns the created todo as json modified string
	 */
	function createTodo(string $inputNewTodoDataString): string|false
	{
		global $dbPDO;

        $inputNewTodoDataXmlObject = simplexml_load_string($inputNewTodoDataString);    //string -> XML object
        $todoArray = xmlToArray($inputNewTodoDataXmlObject);        //XML Object -> array[XML Objects]

        $todoElementSimpleXMLObj = $todoArray['todo'];      //inner array[XML Objects]

        //convert values into correct datatypes
        foreach ($todoElementSimpleXMLObj->children() as $key => $value) {
            echo "
            key = $key
            value = $value
        ";
            //TODO: gleiches probem wie bei updateTodo gestern.
            //<todo> ist ein SimpleXMLObject
            //childs sind string

            if (strcmp($key, 'status') == 0) {
                $value = (int)$value;

            } elseif (strcmp($key, 'description') == 0 | strcmp($key, 'lastUpdate') == 0 | strcmp($key, 'title') == 0) {
                $value = (string)$value;
            }
            $newTodoArray[$key] = $value;
        }

        varDEBUG("todoArray['todo']->children()", $todoArray['todo']->children());

        if (isset($newTodoArray)) {
            printf("No item has been created.");
            return errormessage(500);
        }

		//array durchsuchen
		foreach ($newTodoArray as $todo) {

			$parser = xml_parser_create();
			xml_parser_set_option($parser, XML_OPTION_CASE_FOLDING, 0);
			xml_parser_set_option($parser, XML_OPTION_SKIP_WHITE, 0);

			xml_parse_into_struct($parser, $todo, $vals);
			xml_parser_free($parser);

			$todoData = [];

			if (array_key_exists(0, $vals)) {

				foreach ($vals as $val) {
					if (array_key_exists('value', $val) && !is_null($val["value"])) {
						$todoData[$val['tag']] = $val["value"];
					}
				}
			}

            //printf("todoData:\n");
			//print_r($todoData);
//
			//foreach ($todoData as $tag => $value) {
			//	switch ($tag) {
			//		case 'title':
			//			printf("title = " . $tag . " ::: " . $value . "\n");
			//			break;
			//		case 'status':
			//			printf("status = " . $tag . " ::: " . $value . "\n");
			//			break;
			//		case 'description':
			//			printf("description = " . $tag . " ::: " . $value . "\n");
			//			break;
			//		case 'lastUpdate':
			//			printf("lastUpdate = " . $tag . " ::: " . $value . "\n");
			//			break;
			//		default:
			//			printf("tag = " . $tag . "\n");
			//	}
			//}
		}

        if (empty($todoData)) {
            return errormessage(500);
        }

		// check if status exists ant is valid
		if (array_key_exists('status', $todoData)) {
			$todoData['status'] = statusCheck($todoData['status']);
		} else {
			//set status = 2 as default
			$todoData['status'] = 2;
		}

        //set createDate to the actuall date
        $createDate = date('Y-m-d', time());

		try {
			$todoToSQL = "INSERT INTO todotable
                           (title, status, description, createDate, lastUpdate)
                           VALUES ( :title, :status, :description, createDate, :lastUpdate)";
			$createdTodo = $dbPDO->prepare($todoToSQL);
			$createdTodo->execute([
				'title' => $todoData['title'],
				'status' => $todoData['status'],
				'description' => $todoData['description'],
                'createDate' =>$createDate,
				'lastUpdate' => $todoData['lastUpdate']
			]);

			// TODO: countData durch rowCount() ersetzen?
			//json_encode($dbPDO->query("SELECT * FROM todotable LIMIT " . (rowCount($dbPDO) - 1) . ", 1")->fetchAll(PDO::FETCH_ASSOC));
			return errormessage(200);
		} catch (PDOException $e) {
			echo 'Der createTodo hat nicht geklappt:<br>' . $e->getMessage();
			return false;
		}
	}

	/**
	 * Returns an array with all todos
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
			echo 'Der getAllTodo hat nicht geklappt:<br>' . $e->getMessage();
			//echo json_encode(['error' => $e->getMessage()]);
			return false;
		}
	}

	/**
	 * Returns an array with all todos  with status != 5 | 1
	 * @return array|false
	 */
	function getAllActiveTodos(): array|false
	{
		global $dbPDO;

		try {
			//status 1 => deleted, status 5 => done } => both inaktive
			$sqlSelectAllActiveTodos = 'SELECT * FROM todotable WHERE status != (5 | 1)';

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
	 * Returns an array of all todos => status == 5 | 1
	 * @return array|false
	 */
	function getAllInactiveTodos(): array|false
	{
		global $dbPDO;

		try {
			$selectAllInactiveTodos = 'SELECT * FROM todotable WHERE status = (5 | 1)';

			$stmt = $dbPDO->prepare($selectAllInactiveTodos);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			echo 'getTodoByStatus hat nicht geklappt:<br>' . $e->getMessage();
			return false;
		}
	}

	/**
	 *  read function (select) - is important for the archiv and the bin
	 *  assoc in rows
	 *
	 * @param int $inputStatus
	 *
	 * @return array|false returns to-do as an array or false
	 */
	function getAllTodosByStatus(int $inputStatus): array|false
	{
		global $dbPDO;

		try {
			$dbPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$selectAllTodosByStatus = 'SELECT * FROM todotable WHERE status = :statusValue';

			$expectedTodoByStatus = $dbPDO->prepare($selectAllTodosByStatus);
			$expectedTodoByStatus->execute(['statusValue' => $inputStatus]);

			echo json_encode($expectedTodoByStatus->fetchAll(PDO::FETCH_ASSOC), JSON_PRETTY_PRINT);

			return ($expectedTodoByStatus->fetchAll(PDO::FETCH_ASSOC));
		} catch (PDOException $e) {
			echo 'getTodoByStatus hat nicht geklappt:<br>' . $e->getMessage();
			return false;
		}
	}

	/***
	 * GET a to-do by its ID
	 * uses FETCH_ASSOC [0] to get just the first one
	 *
	 * @param int $id
	 *
	 * @return array|false
	 */
	function getTodoById(int $id): array|false
	{
		global $dbPDO;

		//TODO: maybe bullshit - maybe important but param is bullshit
		$id = $_GET['id'];

		//check if id exist in DB
		if (!checkID($id)) {
			return errormessage(404);
		}

		try {
			$sqlSelectTodoByID = 'SELECT * FROM todotable WHERE ID = :id';

			$expectedTodoById = $dbPDO->prepare($sqlSelectTodoByID);

			/** maybe bullshit, because ID is known */    //bind the param to
			$expectedTodoById->bindParam(':id', $id);


			$expectedTodoById->execute(['id' => $id]);

			$checkedIDTodo = ($expectedTodoById->fetchAll(PDO::FETCH_ASSOC))[0];

			//check if array is empty
			if (empty($checkedIDTodo)) {
				return errormessage(404);
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
     *
     * @param string $inputTodoDataArray - todo as an array
     * @param int $id
     *
     * @return array|bool
     */
	function updateTodo(string $inputTodoDataArray, int $id): array|bool
	{
		global $dbPDO;

        $xmlObject = simplexml_load_string($inputTodoDataArray);    //string -> XML object
        $todoArray = xmlToArray($xmlObject);

        $todoElementSimpleXMLObj = $todoArray['todo'];

        foreach ($todoElementSimpleXMLObj->children() as $key => $value) {

            if (strcmp($key, 'status') == 0) {
                $value = (int)$value;

            } elseif (strcmp($key, 'description') == 0 | strcmp($key, 'lastUpdate') == 0 | strcmp($key, 'title') == 0) {
                $value = (string)$value;
            }
            $updateArray[$key] = $value;
        }

		//exit for invalid IDs
		if (!($id > 0)) {
			errormessage(404);
			return true;
		}

        if (empty($updateArray)) {
            return errormessage(500);
        }

		try {
			$updateTodo = 'UPDATE todotable
                            SET title = :title,
                                status = :status,
                                description = :description,
                                updateDate = :updateDate,
                                lastUpdate = :lastUpdate
                            WHERE ID = :ID';

			// check if status is valid
			$updateArray['status'] = statusCheck($updateArray['status']);

            //set updateDate to the actuall date
            $updateDate = date('Y-m-d', time());

			$prepUpdatedTodo = $dbPDO->prepare($updateTodo);
			$prepUpdatedTodo->execute([
				'ID' => $id,
				'title' => $updateArray['title'],
				'status' => $updateArray['status'],
				'description' => $updateArray['description'],
                'updateDate' => $updateDate,
				'lastUpdate' => $updateArray['lastUpdate']
			]);

			return getTodoById($id);
		} catch (PDOException $e) {
			echo 'Das updateTodo hat nicht geklappt:
            ' . $e->getMessage();
			return false;
		}
	}

	/**
	 * delete function
	 *
	 * @param $id - of the item to delete
	 *
	 * @return bool
	 */
	function deleteTodo($id): bool
	{
		global $dbPDO;

		try {
			$deleteTodo = 'DELETE FROM todotable
            WHERE ID = :IDValue';
			$stmt = $dbPDO->prepare($deleteTodo);
			$stmt->execute(['IDValue' => $id]);
			echo 'DELETE hat ' . $stmt->rowCount() . ' Zeilen gelöscht. <br>';
			echo 'DELETE hat den Eintrag mit der ID: ' . $id . ' endgültig gelöscht.';
			return true;
		} catch (PDOException $e) {
			echo 'DELETE hat nicht geklappt:<br>' . $e->getMessage();
			return false;
		}
	}

    //function createTask           //TODO Nr. 3: Task stuff

    //function getTaskById          //TODO Nr. 3: Task stuff

    //function getAllTasksByTodoID  //TODO Nr. 3: Task stuff

    //function countTaskByTodoID    //TODO Nr. 3: Task stuff -> Maybe bullshit

    //function updateTask           //TODO Nr. 3: Task stuff

    //function deleteTask           //TODO Nr. 3: Task stuff

	/**
	 * function to figure out, how many data is stored in the db
	 *
	 * @return int|false - number of rows/data in the db
	 * @return false if not successful
	 */
	function countActiveTodos(): int|false
	{
		global $dbPDO;
		try {
			$dbPDO->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			$stmt = $dbPDO->prepare('SELECT COUNT(*) as dbSize FROM todotable');
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
	 *
	 * @param $statusInput - status as integer
	 *
	 * @return int - status value, by default 2 if status was not 1, 2, 3, 4, or 5
	 */
	function statusCheck(int $statusInput): int
	{
		//set default status = 2 if not 1-5
		// ?? is_null($statusInput) ? 2 : $statusInput;
		return (($statusInput !== (1 || 2 || 3 || 4 || 5)) ? 2 : $statusInput);
	}

	/**
	 * checks if the given ID is known by the backend
	 * @param int $id - ID to look for
	 *
	 * @return array|false - returns the array of the questionable todo
	 */
	function checkID(int $id): array|false
	{
		$allTodosArray = getAllTodos();

		foreach ($allTodosArray as $todo) {
			if ($id === $todo['ID']) {
				return $todo;
			}
		}
		return false;
	}

	/**
	 * Datenformatierung zu XML für mehrere Elemente
	 *
	 * @param array $todos - Array von Todos
	 *
	 * @return string - XML formatierte Todos
	 */
	function xmlFormatter(array $todos): string
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

	/**
	 * Datenformatierung zu XML für ein einzelnes Element
	 *
	 * @param array $todo - Array eines Todos
	 *
	 * @return string - XML formatiertes Todo
	 */
	function xmlFormatterSingle(array $todo): string
	{
        //TODO: neu formatieren. todos->todo->elemente => todo->elemente
        //----: 'todos'-ebene ist nicht notwendig, nur ein element
        //----: überlegung: zeile (1) löschen, zeile (2) todoElement durch xml ersetzen
		$xml = new SimpleXMLElement('<todos/>');

		$todoElement = $xml->addChild('todo');  //todo: (1)
		foreach ($todo as $key => $value) {

			$todoElement->addChild($key, htmlspecialchars($value)); //todo: (2)
		}

		header('Content-Type: application/xml');
		return $xml->asXML();
	}

    /** Formatter XML -> asso. Array
    * @param $xml
    * @return array
    */
    function xmlToArray ($xml): array {
        $outputArray = [];
        foreach ($xml as $key => $value) {
            $outputArray[$key] = $value;
        }
        return $outputArray;
    }

    /** checks variable and datatype
     * @param string $input
     * @param $data
     * @return void
     */
    function varDEBUG (string $input, $data): void
    {
        echo "
        XXXXXXXXXXXX
        varDEBUG
        XXXXXXXXXXXX
        var_dump $input =
        ";
        var_dump($data);
        echo "
        XXXXXXXXXXXX
        varDEBUG end
        XXXXXXXXXXXX
        ";
    }