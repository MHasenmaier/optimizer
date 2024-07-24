<?php
include("api.php");

	/**
	 * routing function with switch-case for $_SERVER['REQUEST_METHOD']
	 * PUT is still missing
	 * parameter possibly wrong / not complete
	 *
	 * @return bool - true if routing was successful
	 */
	function routing ($dbPDO) : bool
	{
		//cuts the unnecessary part of the path
		$requestSegments = explode('/optimizer/src/backend/index.php', $_SERVER['REQUEST_URI']);

		//check if the part has exact 2 parts and if the second part is not empty
		//more than 2 parts are
		if (count($requestSegments) !== 2 || $requestSegments[1] == "") {
			return errormessage(404);
		}

		$path = explode("/", $requestSegments[1]);
		$pathPartsCounted = count($path);

		if ($pathPartsCounted > 3) {
			echo "too many segments", PHP_EOL;
			echo $pathPartsCounted . 'x pathPartsCounted (> 2)', PHP_EOL;
		}

		$nonNumberChar = preg_match("/D/", $path[2]);

		if ($nonNumberChar === 1)
		{
			return false;
		}

		switch ($_SERVER['REQUEST_METHOD']) {
			case 'GET':
				switch ($path[1]) {
					case 'activetodos':
						$getAllActiveTodos = getAllActiveTodos();
						if (!$getAllActiveTodos)
						{
							return false;
						}
						echo json_encode($getAllActiveTodos);
						return errormessage(200);

					case 'inactivetodos':
						$getAllInactiveTodos = getAllInactiveTodos();
						if (!$getAllInactiveTodos)
						{
							return false;
						}
						echo json_encode($getAllInactiveTodos);
						return errormessage(200);

					case 'todo':
						if ($pathPartsCounted > 3 || !is_numeric($path[2]))
						{
							return errormessage(404);
						}
						$getTodoById = getTodoById($path[2]);
						if ( is_null($getTodoById ))
						{
							return errormessage(404);
						}
						if (!$getTodoById)
						{
							return false;
						}

						echo json_encode($getTodoById);
						return errormessage(200);

					default:
						errormessage(404);
						return true;
				}

			case 'POST':
				switch ($path[1]) {
					case 'newtodo':
						createTodo();
					return errormessage(200);;

					//case '/updatetodo/' . $id:
//
					//	if (str_ends_with($requestPath, "/")) {
					//	 	($requestPath)
					//	}

						// $segments = split(/update/, requestPath)
						// ['/update/', '22']
						// ['/update/', '2k2/']
						// $id = seggel[1]
						// update/:id/

						//		for(int i = 0; str.len; i++)
						//			{
						//				ist das keine zahl => false
						//			}
						//
						//	new Regex("/[0-9]+/g");

						//			switch (true) {
						//				// /update/25/
						//				// /update/25
						//				case '/update/' . $id . '/'  === $requestPath:
						//					break;
						//			}


						//updateTodo($id);
					return true;
				}
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
                $_SERVER["REQUEST_METHOD"]: ' . var_dump($_SERVER['REQUEST_METHOD']) . '
                $dbPDO: ' . var_dump($dbPDO);
				errormessage(404);
				break;
		}
		return false;
	}

	/**
	 * @param $errorcode
	 * return false if unknown error code -> non-http error code
	 * @return true|false
	 */
	function errormessage($errorcode):bool
	{
		switch ($errorcode) {
			case 200:
				http_response_code(200);
				break;

			case 404:
				http_response_code(404);
				echo json_encode(['routing-error:' => 'Error Code: 404 - Not Found']);
				break;

			case 500:
				http_response_code(500);
				echo json_encode(['routing-error:' => 'Error Code: 500 - Internal Server Error']);
				break;

			default:
				echo 'Unknown error code: ' . $errorcode;
				return false;
		}
		return true;
	}
