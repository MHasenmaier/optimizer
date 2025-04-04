<?php
	include_once("server.php");

	//
	// ===============================
	// TODO-Funktionen
	// ===============================
	//

	/**
	 * Erstellt ein neues Todo aus XML-Daten
	 *
	 * @param string $inputXML
	 *
	 * @return array|null
	 */
	function createTodo(string $inputXML): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("createTodo", "getPDO() fehlgeschlagen");
			return null;
		}

		$xml = simplexml_load_string($inputXML);
		if (!$xml) {
			logDebug("createTodo", "Fehler beim Parsen des XML");
			return null;
		}

		$data = xmlToArray($xml);
		$todo = convertXmlEntity('todo', $data);


		if ($todo === null) {
			logDebug("createTodo", "Kein <todo>-Knoten gefunden oder invalid");
			return null;
		}


		$todo['status'] = statusCheck($todo['status'] ?? 2);
		$todo['lastUpdate'] = $todo['lastUpdate'] ?? date('Y-m-d');

		try {
			$stmt = $dbPDO->prepare("
			INSERT INTO todotable (title, status, description, lastUpdate)
			VALUES (:title, :status, :description, :lastUpdate)
		");
			$stmt->execute([
				'title' => $todo['title'],
				'status' => $todo['status'],
				'description' => $todo['description'],
				'lastUpdate' => $todo['lastUpdate']
			]);

			return $dbPDO->query("SELECT * FROM todotable ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);

		} catch (PDOException $e) {
			logDebug("createTodo", $e->getMessage());
			return null;
		}
	}

	/**
	 * Gibt alle Todos mit Status IN (Liste) oder NOT IN (negiert) zurück
	 *
	 * @param array $statusList
	 * @param bool  $negate - true = NOT IN, false = IN
	 *
	 * @return array|null
	 */
	function getTodosByStatusList(array $statusList, bool $negate = false): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("getTodosByStatusList", "getPDO() fehlgeschlagen");
			return null;
		}

		if (empty($statusList)) return null;
		$placeholders = implode(',', array_fill(0, count($statusList), '?'));
		$operator = $negate ? 'NOT IN' : 'IN';

		try {
			$sql = "SELECT * FROM todotable WHERE status $operator ($placeholders)";
			$stmt = $dbPDO->prepare($sql);
			$stmt->execute($statusList);
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			logDebug("getTodosByStatusList", $e->getMessage());
			return null;
		}
	}

	/**
	 * Gibt ein Todo anhand seiner ID zurück
	 *
	 * @param int $id
	 *
	 * @return array|null
	 */
	function getTodoById(int $id): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("getTodoById", "getPDO() fehlgeschlagen");
			return null;
		}

		if (!checkID($id)) return null;

		try {
			$stmt = $dbPDO->prepare("SELECT * FROM todotable WHERE id = :id");
			$stmt->execute(['id' => $id]);
			return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
		} catch (PDOException $e) {
			logDebug("getTodoById", $e->getMessage());
			return null;
		}
	}

	/**
	 * Aktualisiert ein Todo anhand seiner ID
	 *
	 * @param string $inputXML
	 * @param int    $id
	 *
	 * @return array|null
	 */
	function updateTodo(string $inputXML, int $id): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("updateTodo", "getPDO() fehlgeschlagen");
			return null;
		}

		if ($id <= 0) return null;

		$xml = simplexml_load_string($inputXML);
		if (!$xml) return null;

		$data = xmlToArray($xml);
		$update = convertXmlEntity('todo', $data);
		if ($update === null) return null;

		$update['status'] = statusCheck($update['status']);
		$update['lastUpdate'] = $update['lastUpdate'] ?? date('Y-m-d');

		try {
			$sql = "UPDATE todotable
				SET title = :title,
					status = :status,
					description = :description,
					lastUpdate = :lastUpdate
				WHERE id = :id";

			$stmt = $dbPDO->prepare($sql);
			$stmt->execute([
				'id' => $id,
				'title' => $update['title'],
				'status' => $update['status'],
				'description' => $update['description'],
				'lastUpdate' => $update['lastUpdate']
			]);

			if (isset($data['task']) && is_array($data['task'])) {
				updateTasksForTodo($id, $data['task']);
			}

			return getTodoById($id);
		} catch (PDOException $e) {
			logDebug("updateTodo", $e->getMessage());
			return null;
		}
	}

	/**
	 * Aktualisiert alle Task-Verknüpfungen für ein gegebenes Todo
	 *
	 * @param int   $todoId
	 * @param array $taskIds
	 *
	 * @return bool
	 */
	function updateTasksForTodo(int $todoId, array $taskIds): bool
	{
		$dbPDO = getPDO();
		if (!$dbPDO) return false;

		try {
			// Bestehende Verknüpfungen löschen
			$stmtDelete = $dbPDO->prepare("DELETE FROM linktable WHERE todo_id = :todoId");
			$stmtDelete->execute(['todoId' => $todoId]);

			// Neue Verknüpfungen einfügen
			$stmtInsert = $dbPDO->prepare("INSERT INTO linktable (task_id, todo_id) VALUES (:taskId, :todoId)");
			foreach ($taskIds as $taskId) {
				$stmtInsert->execute(['taskId' => (int)$taskId, 'todoId' => $todoId]);
			}

			return true;
		} catch (PDOException $e) {
			logDebug("updateTasksForTodo($todoId)", $e->getMessage());
			return false;
		}
	}


	/**
	 * Gibt die Anzahl aller aktiven Todos zurück
	 *
	 * @return int|null
	 */
	function countActiveTodos(): int|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("countActiveTodos", "getPDO() fehlgeschlagen");
			return null;
		}

		try {
			$sql = 'SELECT COUNT(*) as dbSize FROM todotable WHERE status NOT IN (1, 5)';
			$stmt = $dbPDO->prepare($sql);
			$stmt->execute();
			$row = $stmt->fetch();
			return $row['dbSize'] ?? 0;
		} catch (PDOException $e) {
			logDebug("countActiveTodos", $e->getMessage());
			return null;
		}
	}

	//
	// ===============================
	// TASK-Funktionen
	// ===============================
	//

	/**
	 * Erstellt einen neuen Task aus XML-Daten
	 *
	 * @param string $inputXML
	 *
	 * @return array|null
	 */
	function createTask(string $inputXML): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("createTask", "getPDO() fehlgeschlagen");
			return null;
		}

		$xml = simplexml_load_string($inputXML);
		if (!$xml) return null;

		$data = xmlToArray($xml);
		$task = convertXmlEntity('task', $data);
		if ($task === null) return null;

		$task['status'] = statusCheck($task['status'] ?? 2);
		$task['lastUpdate'] = $task['lastUpdate'] ?? date('Y-m-d');

		try {
			$stmt = $dbPDO->prepare("
			INSERT INTO tasktable (title, status, description, lastUpdate)
			VALUES (:title, :status, :description, :lastUpdate)
		");
			$stmt->execute([
				'title' => $task['title'],
				'status' => $task['status'],
				'description' => $task['description'],
				'lastUpdate' => $task['lastUpdate']
			]);

			if (isset($task['todoId']) && is_numeric($task['todoId'])) {
				$newTaskId = $dbPDO->lastInsertId();
				createLinkEntry((int)$newTaskId, (int)$task['todoId']);
			}

			return $dbPDO->query("SELECT * FROM tasktable ORDER BY id DESC LIMIT 1")->fetch(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			logDebug("createTask", $e->getMessage());
			return null;
		}
	}

	/**
	 * Gibt einen Task anhand seiner ID zurück
	 *
	 * @param int $id
	 *
	 * @return array|null
	 */
	function getTaskById(int $id): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("getTaskById", "getPDO() fehlgeschlagen");
			return null;
		}

		try {
			$sql = "
            SELECT t.*, l.todo_id 
            FROM tasktable t
            JOIN linktable l ON t.id = l.task_id
            WHERE t.id = :id
        ";

			$stmt = $dbPDO->prepare($sql);
			$stmt->execute(['id' => $id]);

			return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
		} catch (PDOException $e) {
			logDebug("getTaskById($id)", $e->getMessage());
			return null;
		}
	}

	/**
	 * Aktualisiert einen Task anhand seiner ID
	 *
	 * @param string $inputXML
	 * @param int    $id
	 *
	 * @return array|null
	 */
	function updateTask(string $inputXML, int $id): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("updateTask", "getPDO() fehlgeschlagen");
			return null;
		}

		if ($id <= 0) return null;

		$xml = simplexml_load_string($inputXML);
		if (!$xml) return null;

		$data = xmlToArray($xml);
		$task = convertXmlEntity('task', $data);
		if ($task === null) return null;

		$task['status'] = statusCheck($task['status']);
		$task['lastUpdate'] = $task['lastUpdate'] ?? date('Y-m-d');

		try {
			$sql = "UPDATE tasktable
				SET title = :title,
					status = :status,
					description = :description,
					lastUpdate = :lastUpdate
				WHERE id = :id";

			$stmt = $dbPDO->prepare($sql);
			$stmt->execute([
				'id' => $id,
				'title' => $task['title'],
				'status' => $task['status'],
				'description' => $task['description'],
				'lastUpdate' => $task['lastUpdate']
			]);

			return getTaskById($id);
		} catch (PDOException $e) {
			logDebug("updateTask($id)", $e->getMessage());
			return null;
		}
	}

	/**
	 * Gibt alle Tasks zurück, die zu einem bestimmten Todo gehören
	 *
	 * @param int $taskId (wird in der Praxis meist 0 sein → alle Tasks zu Todo)
	 * @param int $todoId
	 *
	 * @return array|null
	 */
	function getTasksOfTodoById(int $todoId, int $taskId = 0): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) return null;

		try {
			$sql = "
			SELECT *
			FROM tasktable
			JOIN linktable ON tasktable.id = linktable.task_id
			WHERE linktable.todo_id = :todoId
		";

			if ($taskId > 0) {
				$sql .= " AND tasktable.id = :taskId";
			}

			$stmt = $dbPDO->prepare($sql);

			$params = ['todoId' => $todoId];
			if ($taskId > 0) {
				$params['taskId'] = $taskId;
			}

			$stmt->execute($params);
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
			return $result ?: null;

		} catch (PDOException $e) {
			logDebug("getTasksOfTodoById", $e->getMessage());
			return null;
		}
	}

	/**TODO: comment schreiben
	 * @return string|null
	 */
	function getBegonnenTaskCount(): ?string
	{
		$dbPDO = getPDO();
		if (!$dbPDO) return null;

		try {
			$sql = "SELECT COUNT(*) FROM tasktable WHERE status = 4";
			$stmt = $dbPDO->query($sql);
			$count = $stmt->fetchColumn();

			header("Content-Type: text/plain");
			return (string)$count;
		} catch (PDOException $e) {
			error_log("DB-Fehler in getBegonnenTaskCount: " . $e->getMessage());
			http_response_code(500);
			return "-1";
		}
	}

	//
	// ===============================
	// FOKUS-Funktionen
	// ===============================
	//

	/**
	 * Gibt die aktuellen Fokus-Limits (todo_focus und task_focus) zurück
	 *
	 * @return array|null
	 */
	function getFocusLimits(): array|null
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("getFocusLimits", "getPDO() fehlgeschlagen");
			return null;
		}

		try {
			$stmt = $dbPDO->query("SELECT * FROM fokustable");
			$rows = $stmt->fetchAll();

			if (!$rows) return null;

			$focus = ['todo' => null, 'task' => null];
			foreach ($rows as $row) {
				if ($row['item'] === 'todo_focus') {
					$focus['todo'] = (int)$row['anzahl'];
				} elseif ($row['item'] === 'task_focus') {
					$focus['task'] = (int)$row['anzahl'];
				}
			}

			// Nur zurückgeben, wenn beide Werte vorhanden sind
			return ($focus['todo'] !== null && $focus['task'] !== null) ? $focus : null;

		} catch (PDOException $e) {
			logDebug("getFocusLimits", $e->getMessage());
			return null;
		}
	}

	/**
	 * Aktualisiert die Fokus-Limits aus XML-Daten
	 * returns null if internal error occurs
	 *
	 * @param string $inputXML
	 *
	 * @return bool|null
	 */
	function updateFocusLimits(string $inputXML): ?bool
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("updateFocusLimits", "getPDO() fehlgeschlagen");
			return null;
		}

		try {
			$xml = simplexml_load_string($inputXML);
			if (!$xml || !isset($xml->todo->anzahl) || !isset($xml->task->anzahl)) {
				logDebug("updateFocusLimits", "XML-Format ungültig");
				return false;
			}

			$todoAnzahl = (int)$xml->todo->anzahl;
			$taskAnzahl = (int)$xml->task->anzahl;

			$dbPDO->beginTransaction();

			$stmt1 = $dbPDO->prepare("UPDATE fokustable SET anzahl = :value WHERE item = 'todo_focus'");
			$stmt2 = $dbPDO->prepare("UPDATE fokustable SET anzahl = :value WHERE item = 'task_focus'");

			$stmt1->execute(['value' => $todoAnzahl]);
			$stmt2->execute(['value' => $taskAnzahl]);

			$dbPDO->commit();
			return true;

		} catch (PDOException $e) {
			logDebug("updateFocusLimits (SQL)", $e->getMessage());
			$dbPDO->rollBack();
			return false;
		} catch (Exception $e) {
			logDebug("updateFocusLimits (Parse)", $e->getMessage());
			return false;
		}
	}

	/**
	 * Gibt die Fokus-Limits im XML-Format zurück
	 *
	 * @param array $focus
	 *
	 * @return string
	 */
	function xmlFormatterFocus(array $focus): string
	{
		$xml = new SimpleXMLElement('<focus/>');
		$todo = $xml->addChild('todo');
		$todo->addChild('anzahl', $focus['todo']);
		$task = $xml->addChild('task');
		$task->addChild('anzahl', $focus['task']);

		header('Content-Type: application/xml');
		return $xml->asXML();
	}

	//
	// ===============================
	// Utility-Funktionen
	// ===============================
	//

	/**
	 * Konvertiert einen XML-Tag abhängig vom Feldnamen in den passenden Datentyp
	 *
	 * @param string $key
	 * @param mixed  $value
	 *
	 * @return int|string|null
	 */
	function tagTypeConvert(string $key, mixed $value): int|string|null
	{
		return match ($key) {
			'status', 'todoId' => (int)$value,
			'title', 'description', 'lastUpdate' => (string)$value,
			default => null
		};
	}

	/**
	 * @param int $taskId
	 * @param int $todoId
	 *
	 * @return bool
	 */
	function createLinkEntry(int $taskId, int $todoId): bool
	{
		$dbPDO = getPDO();
		if (!$dbPDO) return false;

		try {
			$stmt = $dbPDO->prepare("INSERT INTO linktable (task_id, todo_id) VALUES (:taskId, :todoId)");
			$stmt->execute(['taskId' => $taskId, 'todoId' => $todoId]);
			return true;
		} catch (PDOException $e) {
			logDebug("createLinkEntry", $e->getMessage());
			return false;
		}
	}

	/**
	 * Wandelt ein SimpleXMLElement in ein assoziatives Array um
	 *
	 * @param SimpleXMLElement $xml
	 *
	 * @return array
	 */
	function xmlToArray(SimpleXMLElement $xml): array
	{
		return json_decode(json_encode($xml), true);
	}

	/**
	 * Validiert einen Statuswert (1–5). Gibt 2 zurück, wenn ungültig.
	 *
	 * @param int $statusInput
	 *
	 * @return int
	 */
	function statusCheck(int $statusInput): int
	{
		return ($statusInput >= 1 && $statusInput <= 5) ? $statusInput : 2;
	}

	/**
	 * Prüft, ob die angegebene Todo-ID existiert
	 * returns null if internal error occurs
	 *
	 * @param int $id
	 *
	 * @return bool|null
	 */
	function checkID(int $id): ?bool
	{
		$dbPDO = getPDO();
		if (!$dbPDO) {
			logDebug("createTodo", "getPDO() fehlgeschlagen");
			return null;
		}

		try {
			$stmt = $dbPDO->prepare("SELECT id FROM todotable WHERE id = :id LIMIT 1");
			$stmt->execute(['id' => $id]);
			return (bool)$stmt->fetchColumn();
		} catch (PDOException $e) {
			logDebug("checkID($id)", $e->getMessage());
			return false;
		}
	}

	/**
	 * Wandelt XML in ein assoziatives Array um – basierend auf Typ 'todo' oder 'task'.
	 * Unterstützt beim Typ 'todo' auch eine optionale <tasks>-Liste.
	 *
	 * @param string   $type - "todo" oder "task"
	 * @param stdClass $xml  - XML-Daten (SimpleXMLElement)
	 *
	 * @return array|null - Parsed Entity oder null bei Fehler
	 */
	function convertXmlEntity(string $type, $xml): ?array
	{
		if (!$xml) return null;

		$result = [];

		switch ($type) {
			case 'todo':
			case 'task':
				$requiredFields = ['title', 'description', 'status'];

				foreach ($requiredFields as $field) {
					if (!isset($xml->{$field})) return null;
					$result[$field] = ($field === 'status') ? (int)$xml->{$field} : (string)$xml->{$field};
				}

				if (isset($xml->id)) {
					$result['id'] = (int)$xml->id;
				}

				if ($type === 'todo' && isset($xml->tasks)) {
					$result['task'] = [];
					foreach ($xml->tasks->task as $taskNode) {
						$result['task'][] = (int)$taskNode;
					}
				}

				return $result;

			default:
				return null;
		}
	}




	/**
	 * Wandelt ein Array oder Objekt in XML um (für todo oder task)
	 *
	 * @param array|object $data
	 * @param string       $type     - "todo" oder "task"
	 * @param bool         $multiple - true für Liste, false für einzelnes Element
	 *
	 * @return string
	 */
	function xmlFormatter(array|object $data, string $type = 'todo', bool $multiple = false): string
	{
		$rootName = $multiple ? $type . 's' : $type;
		$xml = new SimpleXMLElement("<$rootName/>");

		if ($multiple) {
			foreach ($data as $item) {
				$element = $xml->addChild($type);
				foreach ($item as $key => $value) {
					$element->addChild($key, htmlspecialchars($value));
				}
			}
		} else {
			foreach ($data as $key => $value) {
				$xml->addChild($key, htmlspecialchars($value));
			}
		}

		header('Content-Type: application/xml');
		return $xml->asXML();
	}