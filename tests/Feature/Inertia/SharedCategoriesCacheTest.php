<?php

namespace Tests\Feature\Inertia;

use App\Services\CategoryNavCache;
use App\Services\CategoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class SharedCategoriesCacheTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
        Cache::flush();
    }

    public function test_shared_categories_are_cached_per_locale(): void
    {
        $this->get('/')->assertOk();

        $this->assertTrue(Cache::has(CategoryNavCache::key(app()->getLocale())));

        Cache::put(CategoryNavCache::key(app()->getLocale()), [['__cached' => true]]);

        $this->get('/')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('cats.categories.0.__cached', true)
            );
    }

    public function test_category_write_flushes_nav_cache(): void
    {
        $this->get('/');
        $this->assertTrue(Cache::has(CategoryNavCache::key('es')));

        $service = app(CategoryService::class);
        $service->update([
            'name_es' => 'Cultura actualizada',
            'name_pt' => 'Cultura atualizada',
            'parent_id' => null,
            'color' => '#111111',
        ], $this->parentCategory);

        $this->assertFalse(Cache::has(CategoryNavCache::key('es')));
        $this->assertFalse(Cache::has(CategoryNavCache::key('pt')));
    }
}
