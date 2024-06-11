<?php

class Todo
{
    private int $id;
    private array $taskId;


    private string $title;
    private string $description;
    private int $status;
    private string $dateOfCreate;
    private string $dateLastUpdate;
    private string $contentLastUpdate;

    public function __construct(string $title) {
        $this->title = $title;
    }

    /**
     * Getter & Setter
     */

    public function createTodo($todoDataArray): void
    {
        $this['title']->setTitle($todoDataArray);
        $this['description']->setDescription($todoDataArray);
        $this['status']->setStatus($todoDataArray);
        $this['lastUpdate']->setContentLastUpdate($todoDataArray);
    }

    public function getID(): int
    {
        return $this->id;
    }

    public function getTaskId(): array
    {
        return $this->taskId;
    }

    public function setTaskId(array $inputTaskId): void
    {
        $this->taskId = $inputTaskId;
    }

    public function setTitle(string $inputTitle): void
    {
        $this->title = $inputTitle;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    public function setDescription(string $inputTodoDescription): void
    {
        $this->description = $inputTodoDescription;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setStatus(int $inputStatus): void
    {
        $this->status = $inputStatus;
    }

    public function getStatus(): int
    {
        return $this->status;
    }

    public function setContentLastUpdate(string $contentLastUpdate): void
    {
        $this->contentLastUpdate = $contentLastUpdate;
    }

    public function getContentLastUpdate(): string
    {
        return $this->contentLastUpdate;
    }

    // no "setDateOfCreate" - is done by the DB automatically

    public function getDateOfCreate(): string
    {

        return $this->dateOfCreate;
    }

    public function setDateLastUpdate(string $setDateLastUpdate): void
    {
        $this->dateLastUpdate = $setDateLastUpdate;
    }

    public function getDateLastUpdate(): string
    {
        return $this->dateLastUpdate;
    }

}