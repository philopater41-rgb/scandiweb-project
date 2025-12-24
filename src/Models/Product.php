<?php

namespace App\Models;

class Product extends Model
{
    public function __construct(?array $data = [])
    {
        parent::__construct($data);
        $this->data['prices'] = [];
        $this->data['attributes'] = [];
    }

    public static function all(?string $category = null): array
    {
        $static = new static();
        $query = 'SELECT * FROM ' . static::$table;
        $params = [];

        if ($category && strtolower($category) !== 'all') {
            $query .= ' WHERE category = :category';
            $params['category'] = $category;
        }

        $productsData = $static->db->query($query, $params)->get();
        $products = array_map(fn ($data) => new static($data), $productsData);
        $productIds = array_map(fn ($product) => $product->id, $products);

        if (empty($productIds)) {
            return [];
        }

        $pricesByProductId = Price::getByProductIds($productIds);
        $attributesByProductId = Attribute::getByProductIds($productIds);

        foreach ($products as $product) {
            $productId = $product->id;
            $gallery = json_decode($product->gallery, true);
            $product->gallery = $gallery !== null && is_array($gallery) ? $gallery : [];
            $product->prices = $pricesByProductId[$productId] ?? [];
            $product->attributes = $attributesByProductId[$productId] ?? [];
        }

        return $products;
    }

    public static function find(string $value, ?string $column = 'id'): ?static
    {
        $product = parent::find($value, $column);

        if ($product) {
            $product->fetchProductDetails();
        }

        return $product;
    }

    private function fetchProductDetails(): void
    {
        $gallery = json_decode($this->gallery, true);
        $this->gallery = $gallery !== null && is_array($gallery) ? $gallery : [];
        $this->prices = Price::getByProductId($this->id);
        $this->attributes = Attribute::getByProductId($this->id);
    }

    public function toArray(): array
    {
        $data = parent::toArray();
        $data['prices'] = array_map(fn ($price) => $price->toArray(), $this->prices);
        $data['attributes'] = array_map(fn ($attribute) => $attribute->toArray(), $this->attributes);
        return $data;
    }
}