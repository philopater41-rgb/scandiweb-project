<?php

namespace App\GraphQL\Resolvers;

use App\Models\Category;

class CategoriesResolver
{
    public static function index(): array
    {
        $categories = Category::all();
        return array_map(fn ($category) => $category->toArray(), $categories);
    }
}