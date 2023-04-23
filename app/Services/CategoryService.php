<?php

namespace App\Services;

use App\Models\Category;
use App\Repositories\CategoryRepository;
use Illuminate\Database\Eloquent\Collection;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository = new CategoryRepository(),
    ) {
    }

    public function index(): Collection
    {
        return $this->categoryRepository->index();
    }

    public function byId($id): ?Category
    {
        return $this->categoryRepository->byId($id);
    }

    public function bySlug($id): ?Category
    {
        return $this->categoryRepository->bySlug($id);
    }
}
