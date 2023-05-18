<?php

namespace App\Repositories;

use App\Models\Tag;
use Illuminate\Database\Eloquent\Collection;

class TagRepository
{
    protected $parentId;

    public function byParentId(?int $parentId): self
    {
        $this->parentId = $parentId;

        return $this;
    }

    public function index(): Collection
    {
        return Tag::where('parent_id', null)->get();
    }

    public function show(string $slug): ?Tag
    {
        return Tag::where('slug', $slug)
            ->firstOrFail();
    }

    public function getChildTag(): Collection
    {
        return Tag::when($this->parentId, function ($query) {
            $query->where('parent_id', $this->parentId);
        })->get([
            'id',
            'name',
            'slug',
        ]);
    }

    public function byId($id): ?Tag
    {
        return Tag::findOrFail($id);
    }

    public function bySlug($slug): ?Tag
    {
        return Tag::whereTranslation('slug', $slug)->firstOrFail();
    }

    public function groupedByParentId(): Collection
    {
        return Tag::where('parent_id', '<>', null)->get()->groupBy('parent_id');
    }
}
