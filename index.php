<!DOCTYPE html>
<html>
<body>
    

<?php
    $stringServername = "localhost";
    $stringUsername = "root";
    $stringPW = "";
    $stringDBname = "optimizer";
    
$con = new mysqli ($stringServername, $stringUsername, $stringPW);
$conDB = new mysqli ($stringServername, $stringUsername, $stringPW, $stringDBname);
$con_DB = mysql_select_db($stringDBname);

//connection test

if (($conDB->connect_error) != null)
{
    echo "<h1> Fehler bei Connect zur : \"" . $stringDBname . "\" Datenbank! </h1>";
    echo $conDB->connect_error;
} else
{
    echo " <h1> Server mit der DB: \"" . $stringDBname . "\" läuft! </h1> ";
    //echo var_dump($conDB);
}

if (($con_DB->connect_error) != null)
{
    echo "<h1> Fehler bei Connect zur : \"" . $stringDBname . "\" Datenbank! </h1>";
    echo $conDB->connect_error;
} else
{
    echo " <h1> Server mit der DB: \"" . $stringDBname . "\" läuft! </h1> ";
    //echo var_dump($conDB);
}


$tasktitle = "testtask";
$taskstatus = 1;
$taskdescription = "TU WAS MAN!";
$tasklastUpdate = "zuletzt wurde der task erstellt";
$tasktodoID = 1;

//gettings
$stringSQLGet = "SELECT * FROM todotable";
//echo var_dump($stringSQLGet);

//https://wiki.selfhtml.org/wiki/PHP/Tutorials/Datenbanken_mit_PHP#Prepared_Statements

//postings
$stringSQLPostTodo = "INSERT INTO todotable
                        (title, status, description, lastUpdate)
                        VALUES
                        (". $tasktitle .", ". $taskstatus .", ". $taskdescription .", ". $tasklastUpdate . ")";

$stringSQLPostTask = "INSERT INTO tasktable (title, status, description, lastUpdate, todo_id) VALUES (". $tasktitle .", ". $taskstatus .", ". $taskdescription .", ". $tasklastUpdate .",". $tasktodoID ." )";

$viewTodoTask = "CREATE VIEW Erstes_Todo AS SELECT ID, title, status FROM todotable";
$showViewTodoTask = "SELECT * FROM Erstes_Todo";

echo $showViewTodoTask;
printf($showViewTodoTask);

exit();
if($conDB->query($stringSQLPostTodo))
{
    echo $stringSQLPostTodo . " <h2> war erfolgreich! </h2>";
} else{
    echo $stringSQLPostTodo . " <h1> war NICHT erfolgreich!</h1>";
    echo "Typ: " . var_dump($stringSQLPostTodo);
}

?>


</body>
</html>