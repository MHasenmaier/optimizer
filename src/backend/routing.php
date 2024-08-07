<?php
	include("api.php");

	/**
	 * routing function with switch-case for $_SERVER['REQUEST_METHOD']
	 * PUT is still missing
	 * parameter possibly wrong / not complete
	 *
	 * @return bool - true if routing was successful
	 */
	function routing($dbPDO): bool
	{
		$id = 0;
		//cuts the unnecessary part of the path
		// $_SERVER['REQUEST_URI'] = /optimizer/src/backend/index.php/
		// $_SERVER['REQUEST_URI'] = string()

		$requestSegments = explode('/', $_SERVER['REQUEST_URI']);

		//check uri parts $requestSegments[1], $requestSegments[2], $requestSegments[3], $requestSegments[4]
		//if not correct uri segments => return 404
//		if (!($requestSegments[1] === 'optimizer' && $requestSegments[2] === 'src' && ($requestSegments[3] === 'backend' | $requestSegments[3] === 'website') && ($requestSegments[4] === 'index.php' | $requestSegments[4] === 'overview.html'))) {
		if (!($requestSegments[1] === 'optimizer' && $requestSegments[2] === 'src' && $requestSegments[3] === 'backend' && $requestSegments[4] === 'index.php')) {
			return errormessage(404);
		}


		//	if (sizeof($requestSegments) === 0) {
		//		echo "\nyou tried to get index.php - check you path!\n";
		//		return false;
		//	}
		//
		//	//check if the part has exact 2 parts and if the second part is not empty
		//	if (count($requestSegments) !== 2 || $requestSegments[1] == "") {
		//		return errormessage(404);
		//	}
		//
		//	$path = explode("/", $requestSegments[1]);
		//	$pathPartsCounted = count($path);
		//
		//	if ($pathPartsCounted > 2) {
		//		echo $pathPartsCounted . " parts counted";
		//	}
		//
		//	if ($pathPartsCounted > 3) {
		//		echo "too many segments", PHP_EOL;
		//		echo $pathPartsCounted . 'x pathPartsCounted (> 2)', PHP_EOL;
		//	}
		//
		//	if (count($path) >= 3) {
		//		$nonNumberChar = preg_match("/D/", $path[2]);
		//		if ($nonNumberChar === 1) {
		//			return false;
		//		}
		//	}

		if (str_contains($requestSegments[5], 'todo?id=')) {
			parse_str($requestSegments[5], $todo);
			// filter out id from uri segments
			$id = $todo['todo?id'];
			echo 'id = ' . $id . '\n';

			$getTodoById = getTodoById($id);
			if (is_null($getTodoById)) {
				return errormessage(404);
			}
			if (!$getTodoById) {
				return false;
			}

			echo xmlFormatter($getTodoById);
			return errormessage(200);

		}


		switch ($_SERVER['REQUEST_METHOD']) {
			case 'GET':
				//checks if requested segment is the last item of the url, to dodge
				//wrong, too long urls
				if (($requestSegments[5] === array_reverse($requestSegments)[0])) {
					switch ($requestSegments[5]) {
						//http://localhost/optimizer/src/website/overview.html
						case 'activetodos':
							$getAllActiveTodos = getAllActiveTodos();
							if (!$getAllActiveTodos) {
								return false;
							}
							echo xmlFormatter($getAllActiveTodos);
							return errormessage(200);

						case 'inactivetodos':
							$getAllInactiveTodos = getAllInactiveTodos();
							if (!$getAllInactiveTodos) {
								return false;
							}
							echo xmlFormatter($getAllInactiveTodos);
							return errormessage(200);

						case 'countaktivetodos':
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


			case 'POST':
				switch ($requestSegments[5]) {
					case 'newtodo':
						createTodo();
						return errormessage(200);

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
						//return true;
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
	 *
	 * @return true|false
	 */
	function errormessage($errorcode): bool
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
