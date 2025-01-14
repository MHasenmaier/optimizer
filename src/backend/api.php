<?php
include 'server.php';

// todo functions
	//TODO: add check function if DB exists
	//TODO: add task functions

	//TODO: initDb um sinnvollen rückgabewert erweitern
	function initDb (): void
	{
		$tableArray = ["todotable", "tasktable", "linktable"];
		try {
			if (!checkDb()){
				//setUpDb();
				echo "DB set up.";
			}

			foreach ($tableArray as $table) {
				if (!tableExists($table)) {
					echo $table . " does not exist.";
				} else {
					echo "about to create " . $table;
					createTables($table);
				}
			}

			echo "Tables created.";

		} catch(PDOException $e) {
			echo "Fehler: " . $e->getMessage();
		}
	}

	/** check if db named "optimizer" exists via pdo->query
	 * @return bool
	 */
	function checkDb (): bool
	{
		global $dbPDO;
		if (!$dbPDO) {
			echo "DB fehlt.";
			//$dbPDO = createNewDB();
			usleep(500000);
			if (!$dbPDO) {
				echo "DB fehlt immer noch.";
				return false;
			}
			return true;
		} else {
			return true;
		}
//		try {
//			global $dbPDO;
//			$result = $dbPDO->query("SHOW DATABASES LIKE optimizerdb");
//			return $result->rowCount() > 0;
//		} catch(PDOException $e) {
//			echo "Fehler in api/checkDb: " . $e->getMessage();
//			return false;
//		}
	}

	/** create a table named "$table"
	 *
	 * @param $table
	 *
	 * @return void
	 */
	function createTables ($table): void
	{
		global $dbPDO;
		$dbPDO->exec("USE optimizerdb");

		//Todo table

		switch ($table) {
			case "todotable":
				$sqlSetUpTodoTable = "CREATE TABLE IF NOT EXISTS todotable (
    						id INT AUTO_INCREMENT PRIMARY KEY,
    						title VARCHAR(255) NOT NULL,
    						description TEXT,
    						status INT NOT NULL,
    						lastupdate TEXT
		)";
				$dbPDO->exec($sqlSetUpTodoTable);
				echo $table . " installed";
				break;

			case "tasktable":
				$sqlSetUpTaskTable = "CREATE TABLE IF NOT EXISTS tasktable (
                            id INT AUTO_INCREMENT PRIMARY_KEY,
    						title VARCHAR(255) NOT NULL,
							description TEXT,
                         	status INT NOT NULL,
                            FOREIGN KEY (todo_id) REFERENCES todotable (id)
        )";
				$dbPDO->exec($sqlSetUpTaskTable);
				echo $table . " installed";
				break;

				case "linktable":
					$sqlSetUpLinkTable = "CREATE TABLE IF NOT EXISTS linktable (
    todo_id INT,
    task_id INT,
    PRIMARY KEY (todo_id, task_id),
    FOREIGN KEY (todo_id) REFERENCES todotable(id),
    FOREIGN KEY (task_id) REFERENCES tasktable(id)
)";
					$dbPDO->exec($sqlSetUpLinkTable);
					echo $table . " installed";
					break;
		}
	}

	function tableExists (string $tableName): bool
	{
		try {
			global $dbPDO;
			$result = $dbPDO->query("SHOW TABLES LIKE " . $tableName);
			return $result->rowCount() > 0;
		} catch(PDOException $e) {
			echo "Fehler in api/tableExists:\n" . $e->getMessage();
			return false;
		}

	}

    /**
     * create function
     * assoc in values
     * if status != number 1-5, staus = 2 by default
     *
     * @param string $inputNewTodoDataString
     * @return array|false -if successful returns the created todo as json modified string
     */
	function createTodo(string $inputNewTodoDataString): array|false {
		global $dbPDO;

        $inputNewTodoDataXmlObject = simplexml_load_string($inputNewTodoDataString);    //string -> XML object
        $todoArray = xmlToArray($inputNewTodoDataXmlObject);        //XML Object -> array[XML Objects]

        $todoElementSimpleXMLObj = $todoArray['todo'];      //inner array[XML Objects]

        //convert values into correct datatypes
        foreach ($todoElementSimpleXMLObj->children() as $key => $value) {
            //convert $value into int (if status) or string (if title, description or lastUpdate)
            $newTodoArray[$key] = tagTypeConvert($key, $value);
        }

        if (!isset($newTodoArray) | empty($newTodoArray)) {
            printf("No item has been created.");
            return false;
        }

		// check if status exists ant is valid
		if (array_key_exists('status', $newTodoArray)) {
            $newTodoArray['status'] = statusCheck($newTodoArray['status']);
		} else {
			//set status = 2 as default
            $newTodoArray['status'] = 2;
		}

        //set createDate to the actuall date
        $createDate = date('Y-m-d', time());

		try {
			$todoToSQL = "INSERT INTO todotable
                           (title, status, description, createDate, lastUpdate)
                           VALUES ( :title, :status, :description, :createDate, :lastUpdate)";
			$createdTodo = $dbPDO->prepare($todoToSQL);
			$createdTodo->execute([
				'title' => $newTodoArray['title'],
				'status' => $newTodoArray['status'],
				'description' => $newTodoArray['description'],
                'createDate' =>$createDate,
				'lastUpdate' => $newTodoArray['lastUpdate']
			]);

            // returns the last created todo based on the todo IDs -> returns array
			return $dbPDO->query("SELECT * FROM todotable ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			echo 'Der createTodo hat nicht geklappt:
			' . $e->getMessage();
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
			$sqlSelectAllActiveTodos = 'SELECT * FROM todotable WHERE status NOT IN (1, 5)';

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
			$selectAllInactiveTodos = 'SELECT * FROM todotable WHERE status IN (1 , 5)';

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
	function getTodoById(int $id): array|bool
	{
		global $dbPDO;

		//check if id exist in DB
		if (!checkID($id)) {
			return false;
		}

		try {
			$sqlSelectTodoByID = 'SELECT * FROM todotable WHERE ID = :id';

			$expectedTodoById = $dbPDO->prepare($sqlSelectTodoByID);
			$expectedTodoById->execute(['id' => $id]);

            // PDOstmt -> array
			$checkedIDTodo = ($expectedTodoById->fetch(PDO::FETCH_ASSOC));

			//check if array is empty
			if ($checkedIDTodo === false) {
				return errormessage(404);
			}

			return $checkedIDTodo;
		} catch (PDOException $e) {
			echo 'getTodoById hat nicht geklappt:
            ' . $e->getMessage();
			return false;
		}
	}

    function printStuff($input)
    {
        echo "printStuff(input = $input)";
        return $input;
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

        echo "inputTodoDataArray = $inputTodoDataArray";

        $xmlObject = simplexml_load_string($inputTodoDataArray);    //string -> XML object
        $todoArray = xmlToArray($xmlObject);                        //xml obj -> array

        $todoElementSimpleXMLObj = $todoArray['todo'];

        foreach ($todoElementSimpleXMLObj->children() as $key => $value) {
            $updateArray[$key] = tagTypeConvert($key, $value);
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
            echo "updateArray = $updateArray[status]";

            //set updateDate to the actual date
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
			printf('DELETE hat ' . $stmt->rowCount() . ' Zeile gelöscht. <br>');
			printf('DELETE hat den Eintrag mit der ID: ' . $id . ' endgültig gelöscht.');
			return true;
		} catch (PDOException $e) {
			echo 'DELETE hat nicht geklappt:<br>' . $e->getMessage();
			return false;
		}
	}

// task functions

    //function createTask           //TODO Nr. 2: Task stuff

    //function getTaskById          //TODO Nr. 2: Task stuff

    //function getAllTasksByTodoID  //TODO Nr. 2: Task stuff

    //function countTaskByTodoID    //TODO Nr. 2: Task stuff -> Maybe bullshit

    //function updateTask           //TODO Nr. 2: Task stuff

    //function deleteTask           //TODO Nr. 2: Task stuff


// support functions

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
			return $row[0]['dbSize'];
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
		return (($statusInput < 1 || $statusInput > 5) ? 2 : $statusInput);
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
		$xml = new SimpleXMLElement('<todo/>');

		foreach ($todo as $key => $value) {
            $xml->addChild($key, htmlspecialchars($value));
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
        
        ++++++++++++
        varDEBUG start
        
        var_dump $input =
        ";
        var_dump($data);
        echo "
        varDEBUG end
        ------------
        
        ";
    }

    //actual not used - can be deleted if backend is working properly
    /** converter for createTodo and updateTodo
     * @param $inputKey
     * @param $inputValue
     * @return bool|int|string
     */
    function tagTypeConvert ($inputKey, $inputValue): bool|int|string {
        if (strcmp($inputKey, 'status') == 0) {
            return (int)$inputValue;
        } elseif (strcmp($inputKey, 'description') == 0 | strcmp($inputKey, 'lastUpdate') == 0 | strcmp($inputKey, 'title') == 0) {
            return (string)$inputValue;
        }
        return errormessage(500);
    }
