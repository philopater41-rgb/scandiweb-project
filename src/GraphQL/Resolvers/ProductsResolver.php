<?php

namespace App\GraphQL\Resolvers;

use App\Models\Product;

class ProductsResolver
{
    public static function index(?string $category = null): array
    {
        $products = Product::all($category);
        return array_map(fn ($product) => $product->toArray(), $products);
    }

    public static function show(string $productId): ?array
    {
        $product = Product::find($productId);
        return $product ? $product->toArray() : null;
    }
}