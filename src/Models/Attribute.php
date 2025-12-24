<?php

namespace App\Models;

class Attribute extends Model
{
    public function __construct(?array $data = [])
    {
        parent::__construct($data);
        if (!isset($this->data['items'])) {
            $this->data['items'] = [];
        }
    }

    public function addItem(array $item): void
    {
        $this->data['items'][] = $item;
    }

    public static function getByProductId($productId): array
    {
        $items = (new static())->db->query(
            'SELECT pa.*, a.name as attribute_name, a.type as attribute_type
            FROM product_attributes pa
            JOIN attributes a ON pa.attribute_id = a.id 
            WHERE product_id = :productId',
            ['productId' => $productId]
        )->get();

        $attributes = [];
        foreach ($items as $item) {
            $attributeId = $item['attribute_id'];
            if (!isset($attributes[$attributeId])) {
                $attributes[$attributeId] = new static([
                    'id' => $item['id'],
                    'attribute_id' => $attributeId,
                    'name' => $item['attribute_name'],
                    'type' => $item['attribute_type'],
                ]);
            }
            $attributes[$attributeId]->addItem([
                'id' => $item['id'],
                'attribute_id' => $attributeId,
                'value' => $item['value'],
                'displayValue' => $item['displayValue'],
            ]);
        }

        return array_values($attributes);
    }

    public static function getByProductIds(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $query = "
            SELECT pa.*, a.name as attribute_name, a.type as attribute_type
            FROM product_attributes pa
            JOIN attributes a ON pa.attribute_id = a.id 
            WHERE pa.product_id IN ($placeholders)
        ";

        $items = (new static())->db->query($query, $productIds)->get();

        $groupedAttributes = [];
        foreach ($items as $item) {
            $productId = $item['product_id'];
            $attributeId = $item['attribute_id'];

            if (!isset($groupedAttributes[$productId][$attributeId])) {
                $groupedAttributes[$productId][$attributeId] = new static([
                    'id' => $item['id'],
                    'attribute_id' => $attributeId,
                    'name' => $item['attribute_name'],
                    'type' => $item['attribute_type'],
                ]);
            }

            $groupedAttributes[$productId][$attributeId]->addItem([
                'id' => $item['id'],
                'attribute_id' => $attributeId,
                'value' => $item['value'],
                'displayValue' => $item['displayValue'],
            ]);
        }
        
        foreach ($groupedAttributes as &$productAttributes) {
            $productAttributes = array_values($productAttributes);
        }

        return $groupedAttributes;
    }

    public function toArray(): array
    {
        return $this->data;
    }
}