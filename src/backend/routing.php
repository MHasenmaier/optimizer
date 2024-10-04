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
        } elseif (
            str_contains($requestedCompleteURL[1], '/todo/?id=') && strcmp($_SERVER['REQUEST_METHOD'], 'GET') === 0 &&
            is_numeric($_GET['id']) &&
            (intval(htmlspecialchars($_GET['id'])) !== 0)
        ) {
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

            echo xmlFormatterSingle($getTodoById);
            return errormessage(200);
        } elseif ((strcmp($requestedCompleteURL[1], "/countaktivetodos") === 0 && strcmp($_SERVER['REQUEST_METHOD'], 'GET') === 0)) {
            //returns number of all active todos (status != 5)
            $countActiveTodos = countActiveTodos();
            if (!$countActiveTodos) {
                return false;
            }
            echo $countActiveTodos;
            return errormessage(200);
        }
        elseif (strcmp($requestedCompleteURL[1], "/todo") == 0 && strcmp($_SERVER['REQUEST_METHOD'], 'POST') == 0) {

            //grab the body
            $entityBody = file_get_contents('php://input');

            $createTodo =  createTodo($entityBody);
            if (!$createTodo) {
                return false;
            }
            echo xmlFormatterSingle($createTodo);
            return errormessage(201);
        } elseif (str_contains($requestedCompleteURL[1], '/todo/?id=') && strcmp($_SERVER['REQUEST_METHOD'], 'POST') === 0 &&
            is_numeric($_GET['id']) &&
            (intval(htmlspecialchars($_GET['id'])) !== 0)) {

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
        } elseif (str_contains($requestedCompleteURL[1], '/todo/?id=') && strcmp($_SERVER['REQUEST_METHOD'], 'DELETE') === 0 &&
            is_numeric($_GET['id']) &&
            (intval(htmlspecialchars($_GET['id'])) !== 0)
        ) {
                // (int)$id but ... nicer
                $id = intval(htmlspecialchars($_GET['id']));
                $getTodoById = getTodoById($id);

                if (deleteTodo($id)) {
                    echo xmlFormatterSingle($getTodoById);
                    return errormessage(200);
                }
                return false;
            }

                //example path
                //http://localhost/optimizer/src/backend/index.php/     /to_do/?id=36
                //               [0]                                       [1]
                //      to_do/?id=36
                //       [0]   [1]
                //      /activetodos
                //          [0]
                switch ($_SERVER['REQUEST_METHOD']) {
                    case 'GET':


                        return errormessage(404);

                    case 'POST':


                    case 'DELETE':
                        //Delete specific to do

                        break;

                    //PUT

                    default:
                        errormessage(405);
                }
                return false;
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
