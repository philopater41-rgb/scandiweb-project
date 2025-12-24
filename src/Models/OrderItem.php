<?php

namespace App\Models;

use App\Database;

class OrderItem extends Model
{
    protected static string $table = 'order_items';

    public function __construct(Product $product, array $itemData)
    {
        parent::__construct();

        $quantity = $itemData['quantity'] ?? 1;
        $price = $product->prices[0]; // Assuming single currency

        $this->product_id = $product->id;
        $this->product_name = $product->name;
        $this->quantity = $quantity;
        $this->paid_amount = $price->amount * $quantity;
        $this->paid_currency = $price->currency['label'];

        $formattedAttributeValues = [];
        foreach ($itemData['attributeValues'] as $attribute) {
            $formattedAttributeValues[strtolower($attribute['id'])] = $attribute['value'];
        }
        $this->attribute_values = json_encode([$formattedAttributeValues]);
    }

    public function save(Database $db): void
    {
        $db->query(
            'INSERT INTO ' . static::$table . ' (order_id, product_id, product_name, attribute_values, quantity, paid_amount, paid_currency) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                $this->order_id,
                $this->product_id,
                $this->product_name,
                $this->attribute_values,
                $this->quantity,
                $this->paid_amount,
                $this->paid_currency,
            ]
        );
    }
}