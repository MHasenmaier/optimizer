<!DOCTYPE html>
<html>

<body>


    <?php
    //mysqli_report(MYSQLI_REPORT_ALL);
    $stringServername = "localhost";
    $stringUsername = "root";
    $stringPW = "";
    $stringDBname = "optimizer";

    $con = new mysqli($stringServername, $stringUsername, $stringPW);
    $conDB = new mysqli($stringServername, $stringUsername, $stringPW, $stringDBname);

    $createTodoTable = 'CREATE TABLE IF NOT EXISTS todotable( ID INT(10) NOT NULL AUTO_INCREMENT,
        taskID INT(10), title VARCHAR(255), status INT(10), description TEXT,
        createDate VARCHAR(255), updateDate VARCHAR(255),
        lastUpdate VARCHAR(255), PRIMARY KEY (ID)
        )';

    $createTaskTable = 'CREATE TABLE IF NOT EXISTS tasktable( ID INT(10) NOT NULL AUTO_INCREMENT,
        title VARCHAR(255), status INT(10), description TEXT,
        createDate VARCHAR(255), updateDate VARCHAR(255),
        lastUpdate VARCHAR(255), PRIMARY KEY (ID)
        )';


    /** CREATE TABLE
     * Name: todoTable create and exist check
     * 
     */
    /*
        if ($conDB->query($createTodoTable))
        {
            echo 'Tabelle: ' .$createTodoTable. ' ::: erfolgreich erstellt.'; 
        } else {
            echo '<h1>Fehler</h1><p>Tabelle: ' .$createTodoTable. ' ::: konnte NICHT erstellt werden.';
        }

        if ($conDB->query($createTaskTable))
        {
            echo 'Tabelle: ' .$createTaskTable. ' ::: erfolgreich erstellt.'; 
        } else {
            echo '<h1>Fehler</h1><p>Tabelle: ' .$createTaskTable. ' ::: konnte NICHT erstellt werden.';
        }
    */


    /** connection test
     * 
     */
    if (($conDB->connect_error) != null) {
        echo "<h1> Fehler bei Connect zur : \"" . $stringDBname . "\" Datenbank! </h1> <br>" . mysqli_connect_error();
    } else {
        echo " <h1> Server mit der DB: \"" . $stringDBname . "\" läuft! </h1> ";
    }

    //charset test
/* NOT WORKING! DEBUG if function is necessary!
    if (!$mysqli->set_charset('utf8mb4'))  //<-- Compiler Error in this line
    {
        echo "<h2>Fehler beim Zeichensatz!</h2><p>Zeichensatz soll >utf8mb4< sein<br>Folgender Fehler: " . $mysqli->error . "</p>";
    }
*/


    class todo
    {
        private int $id;
        private string $title;
        private string $description;
        private int $status;
        //private string $dateOfCreate;
        //private string $dateLastUpdate;
        //private string $contentLastUpdate;
    
        public function __construct(/* int $id */)
        {
            /* $this->id = $id; */
        }

        //Getter - Setter
    
        public function getID(): int
        {
            return $this->id;
        }

        public function setTitle(string $input): void
        {
            $this->title = $input;
        }

        public function getTitle(): string
        {
            return $this->title;
        }

        public function setDescription(string $input): void
        {
            $this->description = $input;
        }

        public function getDescription(): string
        {
            return $this->description;
        }

        public function setStatus(int $input): void
        {
            $this->status = $input;
        }

        public function getStatus(): int
        {
            return $this->status;
        }

    }

    $erstesTodo = new Todo();
    $erstesTodo->setTitle("Das ist der 1 Titel vom 1ten Todo!");
    $erstesTodo->setStatus(4);
    $erstesTodo->setDescription("Die ist die Beschreibung vom ersten Todo! Hier könnte auch mehr stehen. Tut es aber nicht!12345678890");

    $ZweitesTodo = new Todo();
    $ZweitesTodo->setTitle("Das ist der Titel vom 2. Todo!");
    $ZweitesTodo->setStatus(5);
    $ZweitesTodo->setDescription("Beschreibung von Todo NR. 2");

    $drittesTodo = new Todo();
    $drittesTodo->setTitle($conDB->real_escape_string("Das ist der Titel irgendeinem Todo!"));
    $drittesTodo->setStatus(6);
    $drittesTodo->setDescription($conDB->real_escape_string("Hi'a'er 3 steht die Beschreibung"));


    /** [V] INSERT
     *  Insert is not working with ID from class.
     */

    //INSERT TEMPLATE
    $insertTodo = 'INSERT INTO todotable
                    (ID, taskID, title, status, description, createDate, updateDate, lastUpdate)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

    //ERSTES TODO
    $idEins = '';
    $taskidEins = 1;
    $titleEins = $erstesTodo->getTitle();
    $statusEins = $erstesTodo->getStatus();
    $descriptionEins = $erstesTodo->getDescription();
    $createAtEins = "2024-01-11";
    $updateAtEins = "2024-01-11";
    $lastUpdateEins = "todo erstellt";

    if ($stmt = $conDB->prepare($insertTodo)) {
        $stmt->bind_param('iisissss', $idEins, $taskidEins, $titleEins, $statusEins, $descriptionEins, $createAtEins, $updateAtEins, $lastUpdateEins);
        $stmt->execute();
        echo 'Anzahl der geänderten Datensätze: ' . $stmt->affected_rows . '<br>';
        $stmt->close();
    }

    //ZweiTES TODO
    $idZwei = '';
    $taskidZwei = 1;
    $titleZwei = $ZweitesTodo->getTitle();
    $statusZwei = $ZweitesTodo->getStatus();
    $descriptionZwei = $ZweitesTodo->getDescription();
    $createAtZwei = "2024-02-22";
    $updateAtZwei = "2024-02-22";
    $lastUpdateZwei = "todo erstellt";

    if ($stmt = $conDB->prepare($insertTodo)) {
        $stmt->bind_param('iisissss', $idZwei, $taskidZwei, $titleZwei, $statusZwei, $descriptionZwei, $createAtZwei, $updateAtZwei, $lastUpdateZwei);
        $stmt->execute();
        echo 'Anzahl der geänderten Datensätze: ' . $stmt->affected_rows . '<br>';
        $stmt->close();
    }

    //DRITTES TODO
    $iddrei = '';
    $taskiddrei = 1;
    $titledrei = $drittesTodo->getTitle();
    $statusdrei = $drittesTodo->getStatus();
    $descriptiondrei = $drittesTodo->getDescription();
    $createAtdrei = "2024-03-03";
    $updateAtdrei = "2024-03-03";
    $lastUpdatedrei = "33todo erstellt";

    if ($stmt = $conDB->prepare($insertTodo)) {
        $stmt->bind_param('iisissss', $iddrei, $taskiddrei, $titledrei, $statusdrei, $descriptiondrei, $createAtdrei, $updateAtdrei, $lastUpdateZwei);
        $stmt->execute();
        echo 'Anzahl der geänderten Datensätze: ' . $stmt->affected_rows . '<br>';
        $stmt->close();
    }


    /** [V] UPDATE
     * Update is working
     * important:
     *      1. choose the correct table
     *      2. choose the correct item (in this case id = 1)
     */
    /*
    $updateErstesTodo = 'UPDATE todotable
                        SET description = "Ganz tolle neue Beschreibung!!"
                        Where id = 1';

    $conDB->query($updateErstesTodo);
    */

    /** [V] DELETE
     * DELETE is working
     * important:
     *      1. choose the correct table
     *      2. choose the correct item (in this case id = 4)
     */

/*     for ($i = 0; $i < 20; $i++) {
        $deleteTodo = 'DELETE FROM todotable
                    WHERE id = '. $i;
        $conDB->query($deleteTodo);
    } */


    /** [V] READ
     * important!
     *      1. do you have a variable to save the sql call?
     *      2. do you have a variable to save the result of the sql call?
     *      3. do you have a loop to look for all results? (While loop because of "false"-statement if the fetch_array don't find any data)
     *      4. do you use the v1 while loop and print_r?
     *      5. do you use the improved while loop and MYSQLI_ASSOC? (and also echo)
     */

    $readAllSQL = 'SELECT * FROM todotable';
    $allTodo = $conDB->query($readAllSQL);
    /** IMPROVED WHILE LOOP (better formatting)
     *  important:
     *      1. MYSQLI_ASSOC is for calling data from inside of the array by their associative names (MYSQLI_NUM for a regular array and MYSQLI_BOTH for an array which has both indexes (both is standard))
     *      2. use echo
     *      3. use htmlspecialchars if there are special character which are relevant for html and you have to take care about them
     */
    while ($rowTodoTable = $allTodo->fetch_array(MYSQLI_ASSOC)) {
        echo ' ID: '
            . htmlspecialchars($rowTodoTable['ID'])
            . '<br>TaskIDs angehängt: '
            . htmlspecialchars($rowTodoTable['taskID'])
            . '<br>Titel: <h1>'
            . htmlspecialchars($rowTodoTable['title'])
            . '</h1><br>Status: '
            . htmlspecialchars($rowTodoTable['status'])
            . '<br>Beschreibung: '
            . htmlspecialchars($rowTodoTable['description'])
            . '<br>Erstelldatum: '
            . htmlspecialchars($rowTodoTable['createDate'])
            . ' ## Updatedatum: '
            . htmlspecialchars($rowTodoTable['updateDate'])
            . '<br> Letztes Update war: '
            . htmlspecialchars($rowTodoTable['lastUpdate'])
            . "<br><br>\n";
    }
    ?>

</body>

</html>