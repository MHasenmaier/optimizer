<?php

class Server
{
    private string $hostName = 'localhost';
    private string $dbName = 'optimizer';
    private string $userName = 'root';
    private string $password = '';
    private string $charset = 'utf8mb4';
    private string $dsn;
    private array $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    public function __construct()
    {
        $this->dsn = "mysql:host=$this->hostName;dbname=$this->dbName;charset=$this->charset";
    }

    public function startServer(): PDO|false
    {
        try {
            return new PDO($this->dsn, $this->userName, $this->password, $this->options);
        } catch (PDOException $e) {
            echo 'FEHLER beim Verbindungsaufbau: ' . $e->getMessage();
            return false;
        }
    }

    public function getOptions(): array
    {
        return $this->options;
    }

    public function setOptions(array $options): void
    {
        $this->options = $options;
    }

    public function getDsn(): string
    {
        return $this->dsn;
    }

    private function setDsn(string $hostName, string $dbName, string $charset): void
    {
        $this->dsn = "mysql:host=$hostName;dbname=$dbName;charset=$charset";
    }


    public function getHostName(): string
    {
        return $this->hostName;
    }

    public function getDbName(): string
    {
        return $this->dbName;
    }

    public function getUserName(): string
    {
        return $this->userName;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function getCharset(): string
    {
        return $this->charset;
    }


}