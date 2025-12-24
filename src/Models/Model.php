<?php

namespace App\Models;

use App\Database;
use ReflectionClass;

abstract class Model
{
    protected Database $db;
    protected static string $table;
    protected array $data = [];

    public function __construct(?array $data = [])
    {
        $this->db = Database::getInstance();

        if (!isset(static::$table)) {
            static::$table = strtolower((new ReflectionClass($this))->getShortName()) . 's';
        }

        if ($data) {
            $this->fill($data);
        }
    }

    public function __get($name)
    {
        return $this->data[$name] ?? null;
    }

    public function __set($name, $value)
    {
        $this->data[$name] = $value;
    }

    public function fill(array $data): void
    {
        $this->data = array_merge($this->data, $data);
    }

    public static function all(): array
    {
        $results = (new static())->db->query('SELECT * FROM ' . static::$table)->get();
        return array_map(fn ($row) => new static($row), $results);
    }

    public static function find(string $value, ?string $column = 'id'): ?static
    {
        $result = (new static())->db->query(
            'SELECT * FROM ' . static::$table . ' WHERE ' . $column . ' = :value LIMIT 1',
            ['value' => $value]
        )->fetch();

        return $result ? new static($result) : null;
    }

    public function toArray(): array
    {
        return $this->data;
    }
}