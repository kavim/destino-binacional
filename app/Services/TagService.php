<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\TagRepository;
use Illuminate\Database\Eloquent\Collection;

class TagService
{
    public function __construct(
        protected tagRepository $tagRepository = new TagRepository(),
    ) {
    }

    public function index(): Collection
    {
        return $this->tagRepository->index();
    }

    public function byId($id): ?Category
    {
        return $this->tagRepository->byId($id);
    }

    public function bySlug($id): ?Category
    {
        return $this->tagRepository->bySlug($id);
    }

    public function getChildTag(?int $parentId = null): Collection
    {
        return $this->tagRepository->byParentId($parentId)->getChildTag();
    }

    public function groupedByParentId()
    {
        return $this->tagRepository->groupedByParentId();
    }
}
