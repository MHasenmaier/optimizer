<?php
include("api.php");
include("dbserver.php");



	/**
	 * routing function with switch-case for $_SERVER['REQUEST_METHOD']
	 * PUT is still missing
	 * parameter possibly wrong / not complete
	 *
	 * @param $todoDataArray - todo as an array
	 * @param $dbPDO
	 * @return bool - true if routing was successful
	 */

	global $todoDataArray;
	global $dbPDO;



	//var_dump(routing($dbPDO));

	if(!routing($dbPDO))
	{
		echo json_encode(['routing-error:' => 'Error Code: 500 - routing at all was false']);
		http_response_code(500);
	}

	function routing ($dbPDO) : bool
	{
		if (!($_SERVER['REQUEST_METHOD']))
		{
			http_response_code(500);
			echo json_encode(['routing-error:' => 'Error Code: 500 - Request Method unknown']);
			return false;
		}

		if (!($_SERVER['REQUEST_URI']))
		{
			http_response_code(500);
			echo json_encode(['routing-error:' => 'Error Code: 500 - Request URI unknown']);
			return false;
		}

		$requestSegments = explode('/optimizer/src/backend/routing.php', $_SERVER['REQUEST_URI']);

		if(count($requestSegments) !== 2 || $requestSegments[1] == "")
		{
			http_response_code(404);
			echo json_encode(['routing-error:' => 'Error Code: 404 - Not Found']);
			return false;
		}

		$requestePath = $requestSegments[1];


		switch ($_SERVER['REQUEST_METHOD']) {
			case 'GET':
				if ($requestePath === '/api/todos') {
					echo json_encode(getAllTodos());
					return true;
				//} elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
				//	getTodoById($id, $dbPDO);
				//	return true;
				//} elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $status) {
				//	getAllTodosByStatus($status, $dbPDO);
				//	return true;
				}

				break;

			case 'POST':
				//if ($_SERVER['REQUEST_URI'] == '/api/todos'){
				//	createTodo($todoDataArray, $dbPDO);
				//	return true;
				//} elseif ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
				//	updateTodo($todoDataArray, $dbPDO);
				//	return true;
				//}
				break;

			case 'DELETE':
				//if ($_SERVER['REQUEST_URI'] == '/api/todos/'. $id) {
				//	deleteTodo($todoDataArray, $dbPDO);
				//	return true;
				//}
				break;

			//PUT

			default:
				echo 'routing-switch-case im default:
                $_SERVER["REQUEST_METHOD"]: ' . var_dump($_SERVER['REQUEST_METHOD'] . /*'
                $todoDataArray: ' . var_dump($todoDataArray) . */'
                $dbPDO: ' . var_dump($dbPDO));
				http_response_code(404);
				echo json_encode(['error' => '404 Not Found']);
				break;
		}
		return false;
	}
