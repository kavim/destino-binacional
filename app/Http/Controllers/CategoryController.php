<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use RuntimeException;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
    ) {
        $this->authorizeResource(Category::class);
    }

    public function index()
    {
        $parent_categories = $this->categoryService->index();
        $grouped = $this->categoryService->groupedByParentId();

        return Inertia::render('Dashboard/Category/Index', [
            'parent_categories' => $parent_categories,
            'grouped_categories' => $grouped,
        ]);
    }

    public function create(Request $request)
    {
        $request->has('parent_id')
            ? $parent = Category::find($request->parent_id)
            : $parent = null;

        return Inertia::render('Dashboard/Category/Create', [
            'parent' => $parent,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCategoryRequest $request)
    {
        $this->categoryService->store($request->validated());

        return redirect()->route('categories.index');
    }

    public function edit(Category $category)
    {
        $parent = $category->parent ? $category->parent : null;

        return Inertia::render('Dashboard/Category/Edit', [
            'category' => [
                'id' => $category->id,
                'name_es' => $category->name_es,
                'name_pt' => $category->name_pt,
                'parent_id' => $category->parent_id,
                'featured_image' => $category->featured_image,
                'color' => $category->color,
                /** Raw DB path / filename; do not use the icon accessor here (resolved URL). */
                'icon' => $category->getRawOriginal('icon'),
                /** Resolved URL for dashboard preview only. */
                'icon_preview_url' => $category->icon,
            ],
            'parent' => $parent,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        $this->categoryService->update($request->validated(), $category);

        return redirect()->route('categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        try {
            $this->categoryService->destroy($category);
        } catch (RuntimeException $e) {
            abort(422, $e->getMessage());
        }

        return redirect()->route('categories.index')
            ->with('success', 'Category deleted successfully.');
    }
}
