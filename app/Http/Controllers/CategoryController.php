<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService,
    ) {
        $this->categoryService = new CategoryService();
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
    public function store(Request $request)
    {
        if ($request->has('parent_id') && $request->parent_id !== null) {
            $validated = $request->validate([
                'name_es' => 'required|string|max:255',
                'name_pt' => 'required|string|max:255',
                'parent_id' => 'nullable|integer|exists:categories,id',
            ]);
        } else {
            $validated = $request->validate([
                'name_es' => 'required|string|max:255',
                'name_pt' => 'required|string|max:255',
                'parent_id' => 'nullable|integer|exists:categories,id',
                'image' => 'required_if:featured_image,null',
                'featured_image' => 'required_if:image,==,null',
                'color' => 'required_if:parent_id,null|nullable|string|max:255',
                'icon' => [
                    'nullable',
                ],
                'icon_image' => [
                    'required_if:icon,==,null',
                    'image',
                    'max:1024',
                    'mimes:png,svg',
                ],
            ]);
        }

        $this->categoryService->store($validated);

        return redirect()->route('categories.index');
    }

    public function edit(int $id)
    {
        $category = Category::findOrFail($id);
        $parent = $category->parent ? $category->parent : null;

        return Inertia::render('Dashboard/Category/Edit', [
            'category' => [
                'id' => $category->id,
                'name_es' => $category->name_es,
                'name_pt' => $category->name_pt,
                'parent_id' => $category->parent_id,
                'featured_image' => $category->featured_image,
                'color' => $category->color,
                'icone' => $category->icone,
                'icon' => $category->icon,
            ],
            'parent' => $parent,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, int $id)
    {
        $category = Category::findOrfail($id);

        if ($request->has('parent_id') && $request->parent_id !== null) {
            $validated = $request->validate([
                'name_es' => 'required|string|max:255',
                'name_pt' => 'required|string|max:255',
                'parent_id' => 'nullable|integer|exists:categories,id',
            ]);
        } else {
            $validated = $request->validate([
                'name_es' => 'required|string|max:255',
                'name_pt' => 'required|string|max:255',
                'parent_id' => 'nullable|integer|exists:categories,id',
                'image' => 'required_if:featured_image,null',
                'featured_image' => 'required_if:image,==,null',
                'color' => 'required_if:parent_id,null|nullable|string|max:255',
                'icon' => [
                    'required_if:icon_image,==,null',
                ],
                'icon_image' => [
                    'required_if:icon,==,null',
                    'nullable',
                    'image',
                    'max:1024',
                    'mimes:png,svg',
                ],
            ]);
        }

        $this->categoryService->update($validated, $category);

        return redirect()->route('categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
