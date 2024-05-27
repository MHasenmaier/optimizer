<?php

class optimizerTodo
{
    private int $id;
    private string $title;
    private string $description;
    private int $status;
    //private string $dateOfCreate;
    //private string $dateLastUpdate;
    //private string $contentLastUpdate;

    public function __construct(int $id)
    {
        $this->id = $id;
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

$erstesTodo = new optimizerTodo(1);
echo "ID: " .$erstesTodo->getID() . "<br>";

$erstesTodo->setStatus(2);
echo "Status: " . $erstesTodo->getStatus() . "<br>";

$erstesTodo->setTitle("<h2>Das ist der Titel vom ersten Todo!</h2>");
echo "Titel: " . $erstesTodo->getTitle();

$erstesTodo->setDescription("<p>Die ist die Beschreibung vom ersten Todo!<br>Hier könnte auch mehr stehen.<br>Tut es aber nicht!<br>12345678890</p>");
echo "Inhalt: " . $erstesTodo->getDescription();

$erstesTodo = new optimizerTodo(2);
echo "ID: " .$erstesTodo->getID() . "<br>";

$erstesTodo->setStatus(1);
echo "Status: " . $erstesTodo->getStatus() . "<br>";

$erstesTodo->setTitle("<h2>Genug Blödsinn!</h2>");
echo "Titel: " . $erstesTodo->getTitle();

$erstesTodo->setDescription("<p>Genug Blödsinn gemacht.<br>Schreib die Todos in die DB!!</p>");
echo "Inhalt: " . $erstesTodo->getDescription();