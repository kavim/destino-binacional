<?php

namespace Tests\Feature\Dashboard;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    // ── Auth guards ──────────────────────────────────────────────

    public function test_guest_cannot_access_categories_index(): void
    {
        $this->get('/categories')->assertRedirect('/login');
    }

    public function test_guest_cannot_access_categories_create(): void
    {
        $this->get('/categories/create')->assertRedirect('/login');
    }

    public function test_guest_cannot_store_category(): void
    {
        $this->post('/categories', [])->assertRedirect('/login');
    }

    public function test_guest_cannot_edit_category(): void
    {
        $this->get("/categories/{$this->parentCategory->id}/edit")->assertRedirect('/login');
    }

    public function test_guest_cannot_update_category(): void
    {
        $this->put("/categories/{$this->parentCategory->id}", [])->assertRedirect('/login');
    }

    // ── Index ────────────────────────────────────────────────────

    public function test_index_renders_correct_component(): void
    {
        $this->actingAs($this->user)->get('/categories')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Category/Index')
                ->has('parent_categories')
                ->has('grouped_categories')
            );
    }

    public function test_index_lists_parent_categories(): void
    {
        $this->actingAs($this->user)->get('/categories')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('parent_categories', 1)
            );
    }

    public function test_index_groups_child_categories_by_parent(): void
    {
        $this->actingAs($this->user)->get('/categories')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('grouped_categories')
            );
    }

    // ── Create ───────────────────────────────────────────────────

    public function test_create_page_renders_without_parent(): void
    {
        $this->actingAs($this->user)->get('/categories/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Category/Create')
                ->where('parent', null)
            );
    }

    public function test_create_page_renders_with_parent_id(): void
    {
        $this->actingAs($this->user)
            ->get('/categories/create?parent_id='.$this->parentCategory->id)
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Category/Create')
                ->has('parent')
                ->where('parent.id', $this->parentCategory->id)
            );
    }

    // ── Store ────────────────────────────────────────────────────

    public function test_store_subcategory_validates_names(): void
    {
        $this->actingAs($this->user)
            ->post('/categories', [
                'parent_id' => $this->parentCategory->id,
            ])
            ->assertSessionHasErrors(['name_es', 'name_pt']);
    }

    public function test_store_subcategory_creates_and_redirects(): void
    {
        $this->actingAs($this->user)
            ->post('/categories', [
                'name_es' => 'Gastronomía',
                'name_pt' => 'Gastronomia',
                'parent_id' => $this->parentCategory->id,
            ])
            ->assertRedirect('/categories');

        $newCategory = Category::where('parent_id', $this->parentCategory->id)
            ->whereNot('id', $this->childCategory->id)
            ->first();

        $this->assertNotNull($newCategory);
        $this->assertDatabaseHas('category_translations', [
            'category_id' => $newCategory->id,
            'locale' => 'es',
            'name' => 'Gastronomía',
        ]);
        $this->assertDatabaseHas('category_translations', [
            'category_id' => $newCategory->id,
            'locale' => 'pt',
            'name' => 'Gastronomia',
        ]);
    }

    public function test_store_parent_category_validates_required_fields(): void
    {
        $this->actingAs($this->user)
            ->post('/categories', [
                'parent_id' => null,
            ])
            ->assertSessionHasErrors(['name_es', 'name_pt']);
    }

    public function test_store_validates_parent_id_exists(): void
    {
        $this->actingAs($this->user)
            ->post('/categories', [
                'name_es' => 'Test',
                'name_pt' => 'Teste',
                'parent_id' => 99999,
            ])
            ->assertSessionHasErrors('parent_id');
    }

    // ── Edit ─────────────────────────────────────────────────────

    public function test_edit_loads_parent_category_data(): void
    {
        $this->actingAs($this->user)
            ->get("/categories/{$this->parentCategory->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Category/Edit')
                ->has('category')
                ->where('category.id', $this->parentCategory->id)
                ->where('category.name_es', 'Cultura')
                ->where('category.name_pt', 'Cultura')
                ->where('parent', null)
            );
    }

    public function test_edit_loads_child_category_with_parent(): void
    {
        $this->actingAs($this->user)
            ->get("/categories/{$this->childCategory->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard/Category/Edit')
                ->has('category')
                ->where('category.id', $this->childCategory->id)
                ->where('category.parent_id', $this->parentCategory->id)
                ->has('parent')
                ->where('parent.id', $this->parentCategory->id)
            );
    }

    public function test_edit_returns_404_for_nonexistent_category(): void
    {
        $this->actingAs($this->user)
            ->get('/categories/99999/edit')
            ->assertNotFound();
    }

    // ── Update ───────────────────────────────────────────────────

    public function test_update_subcategory_changes_translations(): void
    {
        $this->actingAs($this->user)
            ->put("/categories/{$this->childCategory->id}", [
                'name_es' => 'Teatros',
                'name_pt' => 'Teatros',
                'parent_id' => $this->parentCategory->id,
            ])
            ->assertRedirect('/categories');

        $this->assertDatabaseHas('category_translations', [
            'category_id' => $this->childCategory->id,
            'locale' => 'es',
            'name' => 'Teatros',
            'slug' => 'teatros',
        ]);
        $this->assertDatabaseHas('category_translations', [
            'category_id' => $this->childCategory->id,
            'locale' => 'pt',
            'name' => 'Teatros',
            'slug' => 'teatros',
        ]);
    }

    public function test_update_validates_names_required(): void
    {
        $this->actingAs($this->user)
            ->put("/categories/{$this->childCategory->id}", [
                'parent_id' => $this->parentCategory->id,
            ])
            ->assertSessionHasErrors(['name_es', 'name_pt']);
    }

    public function test_update_validates_name_max_length(): void
    {
        $this->actingAs($this->user)
            ->put("/categories/{$this->childCategory->id}", [
                'name_es' => str_repeat('A', 256),
                'name_pt' => str_repeat('B', 256),
                'parent_id' => $this->parentCategory->id,
            ])
            ->assertSessionHasErrors(['name_es', 'name_pt']);
    }

    public function test_update_nonexistent_category_returns_404(): void
    {
        $this->actingAs($this->user)
            ->put('/categories/99999', [
                'name_es' => 'Test',
                'name_pt' => 'Teste',
            ])
            ->assertNotFound();
    }
}
