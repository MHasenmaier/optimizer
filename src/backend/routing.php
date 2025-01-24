<?php
include_once("api.php");
include_once ("server.php");

/**
 * routing function with switch-case for $_SERVER['REQUEST_METHOD']
 * parameter possibly wrong / not complete
 * @return bool - true if routing was successful
 */
function routing(): bool
{
    //http://localhost:8080/optimizer/src/backend/index.php/ --- REST
    //                      [0]                         --- [1]
    $requestedPHPURL = explode('.php', $_SERVER['REQUEST_URI']);
    //check if the URL starts correctly
    //ignore the "http://localhost" part of the URL, otherwise the function will break
    if (!($requestedPHPURL[0] === '/optimizer/src/backend/index')) {
        return statuscode(404);
    }

    //check if there is something more than just the index.php called
    if (isset($requestedPHPURL[1])) {
        //split by / to work with /todo/?id=
        $requestedFinalURL = explode('/', $requestedPHPURL[1]);

        //switch for request method
        switch ($_SERVER['REQUEST_METHOD']) {
            case 'GET':

                //switch for requested URL
                switch ($requestedFinalURL[1]) {
                    //for overview page
                    case 'activetodos':
						echo checkTable("todotable");
                        $getAllActiveTodos = getAllActiveTodos();
                        if (empty($getAllActiveTodos)) {
                            return false;
                        }
                        echo xmlFormatter($getAllActiveTodos);
                        return statuscode(200);

					//to check if DB exists
	                case 'checkDb':
						$dbExists = testDatabase();
						if (!$dbExists) {
							echo "Error in routing/GET/checkDb - DB couldn't be found";
							return statuscode(500);
						}
						return statuscode(200);

                    //for archive and "marked as deleted"
                    case 'inactivetodos':
                        $getAllInactiveTodos = getAllInactiveTodos();
                        if (!$getAllInactiveTodos) {
                            return false;
                        }
                        echo xmlFormatter($getAllInactiveTodos);
                        return statuscode(200);
                    case 'countaktivetodos' :
                        //returns number of all active todos (status != 5)
                        $countActiveTodos = countActiveTodos();
                        if (!$countActiveTodos) {
                            return false;
                        }
                        echo $countActiveTodos;
                        return statuscode(200);

                    //for getting a specific todo
                    case 'todo' :
                        //check if a second part (f.e. ?id=) is missing
                            if (!isset($requestedFinalURL[2])) {
                                return statuscode(404);
                            }
                            $IdToTest = $_GET['id'];
                            $formattedId = intval(htmlspecialchars($IdToTest));
                            if (is_numeric($IdToTest) &&
                                (($formattedId !== 0) | ($formattedId !== 1))) {

                                //get the todo from backend
                                $getTodoById = getTodoById($formattedId);

                                if (!isset($getTodoById)) {

                                    return statuscode(404);
                                }
                                //check if ID is known by the backend
                                if (is_null($getTodoById) | empty($getTodoById) | ($getTodoById === false) | !(isset($getTodoById) === true)) {
                                    return statuscode(404);
                                }

                                //header("Location: /http://localhost/optimizer/src/website/todo.html");

                                echo xmlFormatterSingle($getTodoById);
                                return statuscode(200);
                            } else {
                                return statuscode(404);
                            }

                    default:
                        return statuscode(404);
                }

	        case 'POST':
				//createTodo
                if ((strcmp($requestedFinalURL[1], "todo") == 0) && strcmp(end($requestedFinalURL), $requestedFinalURL[1]) == 0) {

                    //grab the body -> string
                    $entityBody = file_get_contents('php://input');

                    //check if body is empty
                    if (!$entityBody) {
                        return statuscode(404);
                    }

                    $createTodo = createTodo($entityBody);

                    //check if createTodo works properly
                    if (!$createTodo) {
                        echo "test createTodo in routing/POST";
                        return statuscode(500);
                    }

                    echo xmlFormatterSingle($createTodo);
                    return statuscode(201);

                } elseif (str_contains($requestedFinalURL[1], '?id=') && strcmp(end($requestedFinalURL), $requestedFinalURL[1
	                ]) == 0) {
                    //updateTodo
                    //parse to int: $id
                    $id = intval(htmlspecialchars($_GET['id']));

                    //grab the body
                    $entityBody = file_get_contents('php://input');

                    $updateTodo = updateTodo($entityBody, $id);
                    if (is_null($updateTodo) | empty($updateTodo) | ($updateTodo === false)) {
                        return statuscode(500);
                    }

                    echo xmlFormatterSingle($updateTodo);
                    return statuscode(200);
                }

                return statuscode(404);

            case 'DELETE':
                //Delete specific to do

                //grab ID
                $IdToTest = $_GET['id'];

                //cast string to int
                $formattedId = intval(htmlspecialchars($IdToTest));

                if (str_contains($requestedFinalURL[1], 'todo') && strcmp($requestedFinalURL[2], '?id=') &&
                    (($formattedId !== 0)  | ($formattedId !== 1))
                ) {

                    $getTodoById = getTodoById($formattedId);
                    if (!$getTodoById) {
                        return statuscode(500);
                    }

                    if (deleteTodo($formattedId)) {
                        echo xmlFormatterSingle($getTodoById);
                         return statuscode(200);
                    }
                    return statuscode(500);
                }
                break;

            default:
                statuscode(405);
        }
        return false;
    }
    echo "
    X_X_X_X_X
    what are you doing here????
    check your request method and URL!!
    X_X_X_X_X";
    return false;
}

/**
 * @param $statuscode
 * return false if unknown error code -> non-http error code
 *
 * @return true|false
 */
function statuscode(int $statuscode): bool {
    switch ($statuscode) {
        case 200:   //all good
            http_response_code(200);
            echo json_encode(['message' => 'OK']);
            break;

        case 201:   //created
            http_response_code(201);
            echo json_encode(['message' => 'created']);
            break;

        case 202:   //accepted
            http_response_code(202);
            echo json_encode(['message' => 'accepted']);
            break;

        case 204:   //no content -> content has been deleted
            http_response_code(204);
            echo json_encode(['message' => 'No Content -> content has been deleted']);
            break;

        case 400:   //bad request - malformed syntax
            http_response_code(400);
            echo json_encode(['message' => 'Bad Request']);
            break;

	    case 403: //forbidden
		    http_response_code(403);
			echo json_encode(['message' => 'Forbidden']);
			break;

        case 404:   //not found - server has not found anything matching the request-uri
            http_response_code(404);
            echo json_encode(['message' => 'Not Found']);
            break;

        case 405:   //Not allowed
            http_response_code(405);
            echo json_encode(['message' => 'Method Not Allowed']);
            break;

        case 500:
            http_response_code(500);
            echo json_encode(['message' => 'Internal Server Error']);
            break;

        default:
            http_response_code($statuscode);
            echo json_encode(['message' => "Unknown Error: $statuscode"]);
            return false;
    }
    return true;
}
