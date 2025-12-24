<?php

namespace App\Models;

use App\Database;

class Order extends Model
{
    protected static string $table = 'orders';

    public function __construct(?array $data = [])
    {
        parent::__construct($data);
        $this->data['items'] = [];
    }

    public function addItem(OrderItem $item): void
    {
        $this->data['items'][] = $item;
    }

    public function save(Database $db): void
    {
        if (isset($this->id)) {
            // Update existing order
            $db->query(
                'UPDATE ' . static::$table . ' SET total_amount = ?, total_currency = ? WHERE id = ?',
                [$this->total_amount, $this->total_currency, $this->id]
            );
        } else {
            // Create new order
            $db->query(
                'INSERT INTO ' . static::$table . ' (total_amount, total_currency) VALUES (?, ?)',
                [$this->total_amount, $this->total_currency]
            );
            $this->id = $db->getLastInsertId();
        }

        foreach ($this->items as $item) {
            $item->order_id = $this->id;
            $item->save($db);
        }
    }
}