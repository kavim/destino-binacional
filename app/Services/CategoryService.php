<?php

namespace App\Services;

use App\Models\Category;
use App\Models\CategoryTranslation;
use App\Repositories\CategoryRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

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

    public function groupedByParentId()
    {
        return $this->categoryRepository->groupedByParentId();
    }

    public function store(array $validated)
    {
        $category = Category::create([
            'featured_image' => Arr::get($validated, 'image', false) ? $this->storeFeaturedImage($validated['image']) : 'icons/default.svg',
            'color' => Arr::get($validated, 'color', null),
            'icon' => Arr::get($validated, 'icon_image', false) ? $this->storeIcon($validated['icon_image']) : 'turistico.webp',
            'parent_id' => Arr::get($validated, 'parent_id', false),
        ]);

        CategoryTranslation::create([
            'locale' => 'es',
            'name' => $validated['name_es'],
            'slug' => Str::slug($validated['name_es']),
            'category_id' => $category->id,
        ]);

        CategoryTranslation::create([
            'locale' => 'pt',
            'name' => $validated['name_pt'],
            'slug' => Str::slug($validated['name_pt']),
            'category_id' => $category->id,
        ]);

        return $category;
    }

    public function storeFeaturedImage($image): string
    {
        if (! $image || is_null($image)) {
            return null;
        }

        $width = config('custom.feature_image.width');
        $height = config('custom.feature_image.height');
        $path = config('custom.categories_feature_image.path');
        $featured_image_src = null;

        try {
            $file = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
            $featured_image_src = 'place_'.time().'.'.explode('/', explode(':', substr($image, 0, strpos($image, ';')))[1])[1];
            Image::make($file)->resize($width, $height)->save(storage_path('app/public/'.$path.$featured_image_src));
        } catch (Exception $e) {
            Log::error($e);
        }

        return $featured_image_src;
    }

    public function storeIcon($icon)
    {
        if (! $icon || is_null($icon)) {
            return null;
        }

        $width = config('custom.icons_feature_image.width');
        $height = config('custom.icons_feature_image.height');
        $path = config('custom.icons_feature_image.path');
        $featured_image_src = null;

        try {
            if ($icon->getClientOriginalExtension() === 'svg') {
                $featured_image_src = 'cat_ico_'.time().'.'.$icon->getClientOriginalExtension();
                $icon->storeAs($path, $featured_image_src, 'public');
            } else {
                $featured_image_src = 'cat_ico_'.time().'.'.$icon->getClientOriginalExtension();
                Image::make($icon)->resize($width, $height)->save(storage_path('app/public/'.$path.$featured_image_src));
            }
        } catch (Exception $e) {
            Log::error($e);
        }

        return $featured_image_src;
    }

    public function update(array $validated, Category $category)
    {
        $category->update([
            'featured_image' => Arr::get($validated, 'image', false) ? $this->storeFeaturedImage($validated['image']) : $category->featured_image,
            'color' => Arr::get($validated, 'color', false) ? $validated['color'] : $category->color,
            'icon' => Arr::get($validated, 'icon_image', false) ? $this->storeIcon($validated['icon_image']) : $category->icon,
            'parent_id' => Arr::get($validated, 'parent_id', false) ? $validated['parent_id'] : $category->parent_id,
        ]);

        $cat = CategoryTranslation::firstOrCreate(
            [
                'category_id' => $category->id,
                'locale' => 'es',
            ],
            [
                'name' => $validated['name_es'],
                'slug' => Str::slug($validated['name_es']),
            ]
        );

        $cat->update([
            'name' => $validated['name_es'],
            'slug' => Str::slug($validated['name_es']),
        ]);

        $cat2 = CategoryTranslation::firstOrCreate(
            [
                'category_id' => $category->id,
                'locale' => 'pt',
            ],
            [
                'name' => $validated['name_pt'],
                'slug' => Str::slug($validated['name_pt']),
            ]
        );

        $cat2->update([
            'name' => $validated['name_pt'],
            'slug' => Str::slug($validated['name_pt']),
        ]);

        return $category;
    }
}
