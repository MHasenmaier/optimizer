<?php
	include("api.php");

	/**
	 * routing function with switch-case for $_SERVER['REQUEST_METHOD']
	 * parameter possibly wrong / not complete
	 * @return bool - true if routing was successful
	 */
	function routing(): bool
	{
		$requestPHPSegments = explode('.php', $_SERVER['REQUEST_URI']);

		if (!($requestPHPSegments[0] === '/optimizer/src/backend/index')) {
			return errormessage(404);
		}

		if (isset($requestPHPSegments[1])) {
			$requestSegments = explode('/', $requestPHPSegments[1]);

			if (isset($requestSegments[1]) & $requestSegments[1] === 'todo') {

				if (isset($requestSegments[2]) && str_contains($requestSegments[2], '?id=') & is_numeric($_GET['id']) & !(intval(htmlspecialchars($_GET['id']) == 0))) {

				}
			}
		}

		//example path
		//http://localhost/optimizer/src/backend/index.php/     /todo/?id=36
		//               [0]                                       [1]
		//      todo/?id=36
		//       [0]   [1]
		//      /activetodos
		//          [0]
		switch ($_SERVER['REQUEST_METHOD']) {
			case 'GET':
				//GET specific to-do
				if ($requestSegments[1] === 'todo') {
					if (isset($requestSegments[2]) && str_contains($requestSegments[2], '?id=') & is_numeric($_GET['id']) & !(intval(htmlspecialchars($_GET['id']) == 0))) {

						// (int)$id but ... nicer
						$id = intval(htmlspecialchars($_GET['id']));

						$getTodoById = getTodoById($id);
						if (is_null($getTodoById) | empty($getTodoById) | ($getTodoById === false) | !(isset($getTodoById) === true)) {
							return errormessage(404);
						}
					}
					echo xmlFormatterSingle($getTodoById);
					return errormessage(200);
				}

				//checks if requested segment is the last item of the url, to dodge
				//wrong, too long urls
				if (($requestPHPSegments[1] === array_reverse($requestPHPSegments)[0])) {
					switch ($requestPHPSegments[1]) {

						//get all active todos (status != 5)
						case '/activetodos':
							$getAllActiveTodos = getAllActiveTodos();
							if (!$getAllActiveTodos) {
								return false;
							}
							echo xmlFormatter($getAllActiveTodos);
							return errormessage(200);

						//get all not-active todos (status == 5)
						case '/inactivetodos':
							$getAllInactiveTodos = getAllInactiveTodos();
							if (!$getAllInactiveTodos) {
								return false;
							}
							echo xmlFormatter($getAllInactiveTodos);
							return errormessage(200);

						//returns number of all active todos (status != 5)
						case '/countaktivetodos':
							$countActiveTodos = countActiveTodos();
							if (!$countActiveTodos) {
								return false;
							}
							echo $countActiveTodos;
							return errormessage(200);

						default:
							errormessage(404);
							return true;
					}
				}
				errormessage(404);
				break;

			case 'POST':
				//Update specific todo
				if (isset($requestSegments[1]) && ($requestSegments[1] === 'todo')) {
					if (isset($requestSegments[2]) && str_contains($requestSegments[2], '?id=') & is_numeric($_GET['id']) & !(intval(htmlspecialchars($_GET['id']) == 0))) {

						// (int)$id but ... nicer
						$id = intval(htmlspecialchars($_GET['id']));
						$post = $_POST;

						$updateTodo = updateTodo($post);
						if (is_null($updateTodo) | empty($updateTodo) | ($updateTodo === false)) {
							return errormessage(500);
						}

						echo xmlFormatterSingle($updateTodo);
						return errormessage(200);
					}
				}

				if (($requestPHPSegments[1] & array_reverse($requestPHPSegments)[0])) {
					switch ($requestPHPSegments[1]) {
						case '/todo':

							$body = file_get_contents('php://input');
							echo xmlFormatterSingle($body);
							var_dump($body);

							//TODO: (body) string -> array

							$createTodo = createTodo($body);

							if (is_null($createTodo) | empty($createTodo) | ($createTodo === false)) {
								return errormessage(500);
							}

							echo xmlFormatterSingle($createTodo);
							return errormessage(201);
						default:
							errormessage(404);
							return true;
					}
				}
				errormessage(404);
				break;

			case 'DELETE':
				//Delete specific todo
				if (isset($requestSegments[1]) && ($requestSegments[1] === 'todo')) {
					if (isset($requestSegments[2]) && str_contains($requestSegments[2], '?id=') & is_numeric($_GET['id']) & !(intval(htmlspecialchars($_GET['id']) == 0))) {

						// (int)$id but ... nicer
						$id = intval(htmlspecialchars($_GET['id']));
						$getTodoById = getTodoById($id);

						if (deleteTodo($id)) {
							echo xmlFormatterSingle($getTodoById);
							return errormessage(200);
						}
						return false;
					}
				}
				break;

			//PUT

			default:
				errormessage(405);
		}
		return false;
	}

	/**
	 * @param $errorcode
	 * return false if unknown error code -> non-http error code
	 *
	 * @return true|false
	 */
	function errormessage(int $errorcode): bool
	{
		switch ($errorcode) {
			case 200:   //all good
				http_response_code(200);
				//echo json_encode(['message' => 'OK']);
				break;

			case 201:   //created
				http_response_code(201);
				//echo json_encode(['message' => 'created']);
				break;

			case 202:   //accepted
				http_response_code(202);
				//echo json_encode(['message' => 'accepted']);
				break;

			case 204:   //no content -> content has been deleted
				http_response_code(204);
				//echo json_encode(['message' => 'No Content']);
				break;

			case 400:   //bad request - malformed syntax
				http_response_code(400);
				echo json_encode(['message' => 'Bad Request']);
				break;

			case 404:   //not found - server has not found anything matching the request-uri
				http_response_code(404);
				echo json_encode(['message' => 'Not Found']);
				break;

			case 405:
				http_response_code(405);
				echo json_encode(['message' => 'Method Not Allowed']);
				break;

			case 500:
				http_response_code(500);
				echo json_encode(['message' => 'Internal Server Error']);
				break;

			default:
				http_response_code($errorcode);
				echo json_encode(['message' => $errorcode]);
				return false;
		}
		return true;
	}
