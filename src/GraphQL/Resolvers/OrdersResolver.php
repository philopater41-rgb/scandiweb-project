<?php

namespace App\GraphQL\Resolvers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Database;
use Exception;

class OrdersResolver
{
    public static function store(array $args): string
    {
        if (empty($args['items'])) {
            abort(400, 'Items are required');
        }

        $db = Database::getInstance();
        $db->beginTransaction();

        try {
            $order = new Order();
            $totalAmount = 0;
            $currency = null;

            foreach ($args['items'] as $itemData) {
                $product = self::validateAndGetProduct($itemData);
                $orderItem = new OrderItem($product, $itemData);
                $order->addItem($orderItem);

                $totalAmount += $orderItem->paid_amount;
                if ($currency === null) {
                    $currency = $orderItem->paid_currency;
                }
            }

            $order->total_amount = $totalAmount;
            $order->total_currency = $currency;
            
            $order->save($db);

            $db->commit();

            return "Order placed successfully! Order ID: {$order->id}";
        } catch (Exception $e) {
            $db->rollback();
            abort(500, $e->getMessage());
        }
    }

    private static function validateAndGetProduct(array $item): Product
    {
        $productId = $item['productId'];

        if (!isset($productId)) {
            abort(400, 'Product ID is required');
        }

        $product = Product::find($productId);

        if (!$product) {
            abort(400, 'Product not found');
        }

        if (!$product->inStock) {
            abort(400, "Unfortunately, '{$product->name}' is out of stock. Please check back later.");
        }

        $attributeCount = count($product->attributes);

        if (!isset($item['attributeValues']) || $attributeCount !== count($item['attributeValues'])) {
            abort(400, 'Attribute values are required');
        }

        foreach ($item['attributeValues'] as $attributeValue) {
            $attributeFound = false;
            foreach ($product->attributes as $productAttribute) {
                foreach ($productAttribute->items as $productAttributeItem) {
                    if ($productAttributeItem['id'] === $attributeValue['id'] && $productAttributeItem['value'] === $attributeValue['value']) {
                        $attributeFound = true;
                        break 2;
                    }
                }
            }
            if (!$attributeFound) {
                abort(400, "Oops! '{$product->name}' with '{$attributeValue['value']}' attribute does not exist or is invalid. Please check and try again.");
            }
        }

        return $product;
    }
}