<?php

namespace App\Models;

class Price extends Model
{
    public function __get($name)
    {
        if ($name === 'amount') {
            return number_format($this->data['amount'], 2, thousands_separator: '');
        }
        if ($name === 'currency') {
            return [
                'label' => $this->data['label'],
                'symbol' => $this->data['symbol'],
            ];
        }
        return parent::__get($name);
    }

    public static function getByProductId($productId): array
    {
        $pricesData = (new static())->db->query(
            'SELECT p.amount, c.label, c.symbol FROM prices p JOIN currencies c ON p.currency = c.label WHERE p.product_id = :productId',
            ['productId' => $productId]
        )->get();

        return array_map(fn ($priceData) => new static($priceData), $pricesData);
    }

    public static function getByProductIds(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($productIds), '?'));
        $query = "
            SELECT p.product_id, p.amount, c.label, c.symbol 
            FROM prices p
            JOIN currencies c ON p.currency = c.label
            WHERE p.product_id IN ($placeholders)
        ";

        $pricesData = (new static())->db->query($query, $productIds)->get();

        $groupedPrices = [];
        foreach ($pricesData as $priceData) {
            $productId = $priceData['product_id'];
            $groupedPrices[$productId][] = new static($priceData);
        }

        return $groupedPrices;
    }

    public function toArray(): array
    {
        return [
            'amount' => $this->amount,
            'currency' => $this->currency,
        ];
    }
}