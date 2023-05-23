<?php

namespace App\Repositories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Collection;

class CategoryRepository
{
    public function index(): Collection
    {
        return Category::where('parent_id', null)->get();
    }

    public function show(string $slug): ?Category
    {
        return Category::where('slug', $slug)
            ->firstOrFail();
    }

    public function getChildCategory(int $parentId): Collection
    {
        return Category::where('parent_id', $parentId)
            ->get([
                'id',
                'name',
                'slug',
            ]);
    }

    public function byId($id): ?Category
    {
        return Category::findOrFail($id);
    }

    public function bySlug($slug): ?Category
    {
        return Category::whereTranslation('slug', $slug)->firstOrFail();
    }

    public function groupedByParentId(): Collection
    {
        return Category::where('parent_id', '<>', null)->get()->groupBy('parent_id');
    }
}
