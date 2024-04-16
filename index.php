$conn = @mysql_connect ("localhost", "root", "");

if ($conn == FALSE)
{
    echo "<p> Fehler bei Connect zur Datenbank! </p> \n";
    echo $conn;
    exit();
}
