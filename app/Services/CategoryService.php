<?php

namespace App\Services;

use App\Models\Category;
use App\Models\CategoryTranslation;
use App\Repositories\CategoryRepository;
use Exception;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;

class CategoryService
{
    public function __construct(
        protected CategoryRepository $categoryRepository = new CategoryRepository,
        protected FeaturedImageStorage $featuredImageStorage = new FeaturedImageStorage,
    ) {}

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
        return DB::transaction(function () use ($validated) {
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
        });
    }

    public function storeFeaturedImage($image): ?string
    {
        $config = config('custom.categories_feature_image');

        return $this->featuredImageStorage->storeFromBase64($image, [
            'path' => $config['path'],
            'prefix' => 'place_',
            'width' => $config['width'],
            'height' => $config['height'],
        ]);
    }

    public function storeIcon($icon)
    {
        if (! $icon || is_null($icon)) {
            return null;
        }

        $width = config('custom.icons_feature_image.width');
        $height = config('custom.icons_feature_image.height');
        $dest = public_path('images/icons');
        $featured_image_src = null;

        try {
            $featured_image_src = 'cat_ico_'.time().'.'.$icon->getClientOriginalExtension();

            if ($icon->getClientOriginalExtension() === 'svg') {
                $icon->move($dest, $featured_image_src);
            } else {
                Image::make($icon)->resize($width, $height)->save($dest.'/'.$featured_image_src);
            }
        } catch (Exception $e) {
            Log::error($e);
        }

        return $featured_image_src;
    }

    public function update(array $validated, Category $category)
    {
        return DB::transaction(function () use ($validated, $category) {
            $category->update([
                'featured_image' => Arr::get($validated, 'image', false) ? $this->storeFeaturedImage($validated['image']) : $category->getRawOriginal('featured_image'),
                'color' => Arr::get($validated, 'color', false) ? $validated['color'] : $category->color,
                'icon' => Arr::get($validated, 'icon_image', false) ? $this->storeIcon($validated['icon_image']) : $category->getRawOriginal('icon'),
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
        });
    }
}
