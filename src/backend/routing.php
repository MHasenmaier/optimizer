<?php
	include_once("api.php");
	include_once("server.php");


	function routing(): bool
	{
		$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
		$queryString = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
		parse_str($queryString ?? '', $queryParams);

		$basePath = '/optimizer/src/backend/index.php';
		if (!str_starts_with($requestUri, $basePath)) {
			return statuscode(404, "Ungültiger Pfad");
		}

		$path = trim(substr($requestUri, strlen($basePath)), '/');
		$segments = explode('/', $path);

		$resource = $segments[0] ?? '';
		$method = $_SERVER['REQUEST_METHOD'];

		return match ($method) {
			'GET' => handleGET($resource, $queryParams),
			'POST' => handlePOST($resource),
			'PUT' => handlePUT($resource, $queryParams),
			default => statuscode(405, "HTTP-Methode nicht erlaubt"),
		};
	}


	/** takes care of all GET-requests
	 *
	 * @param string $resource
	 * @param array  $query
	 *
	 * @return bool
	 */
	function handleGET(string $resource, array $query): bool
	{
		switch ($resource) {
			case 'countaktivetodos':
				$count = countActiveTodos();
				if ($count === null) return statuscode(500);
				echo $count;
				return statuscode(200);

			case 'todo':
				if (!isset($query['id'])) return statuscode(400, "ID fehlt");
				$todo = getTodoById((int)$query['id']);
				if ($todo === null) return statuscode(404, "Todo nicht gefunden");
				echo xmlFormatter($todo);
				return statuscode(200);

			case 'task':
				if (!isset($query['id'])) return statuscode(400, "ID fehlt");
				$task = getTaskById((int)$query['id']);
				if ($task === null) return statuscode(404);
				echo xmlFormatter($task, 'task');
				return statuscode(200);

			case 'tasks':
				if (!isset($query['todoid'])) return statuscode(400, "todoid fehlt");

				$tasks = getSpecificTasksOfTodoById(0, (int)$query['todoid']);
				if ($tasks === null) return statuscode(404);

				echo xmlFormatter($tasks, 'task', true);
				return statuscode(200);

			case 'focus':
				$focus = getFocusLimits();
				if ($focus === null) return statuscode(500);
				echo xmlFormatterFocus($focus);
				return statuscode(200);

			case 'setupdb':
				if (!setupDatabase()) return statuscode(500);
				echo "DB anlegen?";
				return statuscode(200);

			case 'activetodos':
				$todos = getTodosByStatusList([1, 5], true); // NOT IN (1,5)
				if ($todos === null) return statuscode(500);
				echo xmlFormatter($todos, 'todo', true);
				return statuscode(200);

			case 'inactivetodos':
				$todos = getTodosByStatusList([1, 5]); // IN (1,5)
				if ($todos === null) return statuscode(500);
				echo xmlFormatter($todos, 'todo', true);
				return statuscode(200);

			case 'dbcheck' :
				if (!checkDatabaseExists()) return statuscode(503, "Datenbankverbindung fehlgeschlagen");
				return statuscode(200, "Datenbankverbindung erfolgreich");

			default:
				return statuscode(404, "Ressource nicht gefunden");
		}
	}

	/** takes care of all POST-requests
	 *
	 * @param string $resource
	 *
	 * @return bool
	 */
	function handlePOST(string $resource): bool
	{
		$body = file_get_contents('php://input');
		header('Content-Type: text/plain');

		if (empty($body)) return statuscode(400, "Leerer Request-Body");

		switch ($resource) {
			case 'todo':
				$todo = createTodo($body);
				if ($todo === null) return statuscode(500);
				echo xmlFormatter($todo, 'todo', false);
				return statuscode(201);

			case 'task':
				$task = createTask($body);
				if ($task === null) return statuscode(500);
				echo xmlFormatter($task, 'task', false);
				return statuscode(201);

			case 'focus':
				if (!updateFocusLimits($body)) return statuscode(500);
				$updatedFocus = getFocusLimits();
				echo xmlFormatterFocus($updatedFocus);
				return statuscode(200);

			default:
				return statuscode(404);
		}
	}

	/** takes care of all PUT-requests
	 *
	 * @param string $resource
	 * @param array  $query
	 *
	 * @return bool
	 */
	function handlePUT(string $resource, array $query): bool
	{
		$body = file_get_contents('php://input');
		if (empty($body)) return statuscode(400, "Leerer Request-Body");

		switch ($resource) {
			case 'todo':
				if (!isset($query['id'])) return statuscode(400, "Todo-ID fehlt");
				$id = (int)$query['id'];
				if ($id <= 0) return statuscode(400, "Ungültige Todo-ID");

				$updated = updateTodo($body, $id);
				if ($updated === null) return statuscode(500, "Todo konnte nicht aktualisiert werden");

				echo xmlFormatter($updated);
				return statuscode(200, "Todo erfolgreich aktualisiert");

			case 'task':
				if (!isset($query['id'])) return statuscode(400, "Task-ID fehlt");
				$id = (int)$query['id'];
				if ($id <= 0) return statuscode(400, "Ungültige Task-ID");

				$updated = updateTask($body, $id);
				if ($updated === null) return statuscode(500, "Task konnte nicht aktualisiert werden");

				echo xmlFormatter($updated, 'task');
				return statuscode(200, "Task erfolgreich aktualisiert");

			case 'focus':
				if (!updateFocusLimits($body)) return statuscode(500);
				$updatedFocus = getFocusLimits();
				echo xmlFormatterFocus($updatedFocus);
				return statuscode(200);

			default:
				return statuscode(404, "Ressource nicht gefunden");
		}
	}