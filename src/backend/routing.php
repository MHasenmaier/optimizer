<?php
include("api.php");

/**
 * routing function with switch-case for $_SERVER['REQUEST_METHOD']
 * parameter possibly wrong / not complete
 * @return bool - true if routing was successful
 */
function routing(): bool
{
    //http://localhost/optimizer/src/backend/index.php/ --- REST
    //                      [0]                         --- [1]
    $requestedCompleteURL = explode('.php', $_SERVER['REQUEST_URI']);
    //check if the URL starts correctly
    if (!($requestedCompleteURL[0] === '/optimizer/src/backend/index')) {
        return errormessage(404);
    }

    //check if there is something more than just the index.php called
    if (isset($requestedCompleteURL[1])) {

        if ( (strcmp($requestedCompleteURL[1], "/activetodos") === 0) && strcmp($_SERVER['REQUEST_METHOD'], 'GET') === 0) {
            $getAllActiveTodos = getAllActiveTodos();
            if (!$getAllActiveTodos) {
                return false;
            }
            echo xmlFormatter($getAllActiveTodos);
            return errormessage(200);
        } elseif (strcmp($requestedCompleteURL[1], "/inactivetodos") === 0 && strcmp($_SERVER['REQUEST_METHOD'], 'GET') === 0) {
            $getAllInactiveTodos = getAllInactiveTodos();
            if (!$getAllInactiveTodos) {
                return false;
            }
            echo xmlFormatter($getAllInactiveTodos);
            return errormessage(200);
        } elseif (strcmp($requestedCompleteURL[1], "/todo") == 0 && strcmp($_SERVER['REQUEST_METHOD'], 'POST') == 0) {
            echo "neues todo erstellen
            ";

            //grab the body
            $entityBody = file_get_contents('php://input');

            /*$createTodo = */ return createTodo($entityBody);
        }

        //the rest of the URL after index.php separated in an array
        $requestSegments = explode('/', $requestedCompleteURL[1]);

        //FixMe: pathing funktioniert nur zufällig richtig.
        //----: notwendige und hinreicheinde bedingungen identifizieren und anpassen
        //----: bspw.: schließen manche bedingungen den allgemeinen zugriff auf, z. B. "alle aktiven" to dos aus

        //update    http://localhost/optimizer/src/backend/index.php/   todo/?id=36    //funktioniert

        //get       http://localhost/optimizer/src/backend/index.php/   todo/?id=36    //funktioniert
        //get       http://localhost/optimizer/src/backend/index.php/   inactivetodos  //geht nicht!!
        //get       http://localhost/optimizer/src/backend/index.php/   activetodos    //geht nicht!!

        //create    http://localhost/optimizer/src/backend/index.php/   todo           //geht nicht!!

        //make sure, there is something more
        if (isset($requestSegments[1])) {

            if (isset($requestSegments[2]) && str_contains($requestSegments[2], '?id=') & is_numeric($_GET['id']) & !(intval(htmlspecialchars($_GET['id']) == 0))) {


                //example path
                //http://localhost/optimizer/src/backend/index.php/     /to_do/?id=36
                //               [0]                                       [1]
                //      to_do/?id=36
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
                                if (!isset($getTodoById)) {
                                    return errormessage(404);
                                }
                                if (is_null($getTodoById) | empty($getTodoById) | ($getTodoById === false) | !(isset($getTodoById) === true)) {
                                    return errormessage(404);
                                }

                                header("Location: /http://localhost/optimizer/src/website/todo.html"); //?id=$id

                                //printf($id);
                                echo xmlFormatterSingle($getTodoById);
                                return errormessage(200);
                            }

                            //TODO path isnt working (see also api.php (65) )

                        }

                        //checks if requested segment is the last item of the url, to dodge
                        //wrong, too long urls
                        if (($requestedCompleteURL[1] === array_reverse($requestedCompleteURL)[0])) {
                            switch ($requestedCompleteURL[1]) {
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
                        return errormessage(404);

                    case 'POST':
                        //Update specific to do
                        if (isset($requestSegments[1]) && ($requestSegments[1] === 'todo')) {
                            // update specific to-do
                            if (isset($requestSegments[2]) && str_contains($requestSegments[2], '?id=') & is_numeric($_GET['id']) & !(intval(htmlspecialchars($_GET['id']) == 0))) {

                                // (int)$id but ... nicer

                                $id = intval(htmlspecialchars($_GET['id']));

                                //grab the body
                                $entityBody = file_get_contents('php://input');

                                $updateTodo = updateTodo($entityBody, $id);
                                if (is_null($updateTodo) | empty($updateTodo) | ($updateTodo === false)) {
                                    return errormessage(500);
                                }

                                echo xmlFormatterSingle($updateTodo);
                                return errormessage(200);
                            }

                            //test if '/to do' == '/to do'
                            if (($requestedCompleteURL[1] & array_reverse($requestedCompleteURL)[0])) {
                                //add a new to-do

                                $body = file('php://input');


                                $createTodo = createTodo($body);
                                echo $createTodo;

                                //		if (is_null($createTodo) | empty($createTodo) | ($createTodo === false)) {
                                //			return errormessage(500);
                                //		}
                                //
                                //		echo xmlFormatterSingle($createTodo);
                                return errormessage(201);
                            }
                            return errormessage(404);
                        }

                    case 'DELETE':
                        //Delete specific to do
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
        }
    }
    echo "
    X_X_X_X_X
    what did just happen here????
    X_X_X_X_X";
    return false;
}

/**
 * @param $errorcode
 * return false if unknown error code -> non-http error code
 *
 * @return true|false
 */
function errormessage(int $errorcode): bool {
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
