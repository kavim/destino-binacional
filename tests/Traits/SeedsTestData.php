<?php

namespace Tests\Traits;

use App\Models\Category;
use App\Models\CategoryTranslation;
use App\Models\City;
use App\Models\Country;
use App\Models\PlaceType;
use App\Models\State;
use App\Models\Tag;
use App\Models\TagTranslation;
use App\Models\User;

trait SeedsTestData
{
    protected User $user;

    protected City $city;

    protected PlaceType $placeType;

    protected Category $parentCategory;

    protected Category $childCategory;

    protected Tag $parentTag;

    protected Tag $childTag;

    protected function seedTestData(): void
    {
        $this->user = User::factory()->create();

        $this->placeType = PlaceType::forceCreate(['name' => 'Atractivo']);

        $country = Country::forceCreate(['name' => 'Uruguay', 'code' => 'UY']);
        $state = State::forceCreate(['name' => 'Rivera', 'code' => 'RV', 'country_id' => $country->id]);
        $this->city = City::forceCreate(['name' => 'Rivera', 'state_id' => $state->id]);

        $this->parentCategory = Category::create([
            'color' => '#6366f1',
            'icon' => null,
            'active' => 1,
            'featured_image' => null,
            'type' => 'place',
            'parent_id' => null,
        ]);

        foreach (['es' => 'Cultura', 'pt' => 'Cultura'] as $locale => $name) {
            CategoryTranslation::create([
                'category_id' => $this->parentCategory->id,
                'locale' => $locale,
                'name' => $name,
                'slug' => 'cultura',
                'description' => 'Categoría de prueba',
            ]);
        }

        $this->childCategory = Category::create([
            'color' => '#818cf8',
            'icon' => null,
            'active' => 1,
            'featured_image' => null,
            'type' => 'place',
            'parent_id' => $this->parentCategory->id,
        ]);

        foreach (['es' => 'Museos', 'pt' => 'Museus'] as $locale => $name) {
            CategoryTranslation::create([
                'category_id' => $this->childCategory->id,
                'locale' => $locale,
                'name' => $name,
                'slug' => strtolower($name),
                'description' => 'Sub categoría de prueba',
            ]);
        }

        $this->parentTag = Tag::forceCreate(['parent_id' => null]);
        foreach (['es' => 'Música', 'pt' => 'Música'] as $locale => $name) {
            TagTranslation::forceCreate([
                'tag_id' => $this->parentTag->id,
                'locale' => $locale,
                'name' => $name,
                'slug' => 'musica',
            ]);
        }

        $this->childTag = Tag::forceCreate(['parent_id' => $this->parentTag->id]);
        foreach (['es' => 'Rock', 'pt' => 'Rock'] as $locale => $name) {
            TagTranslation::forceCreate([
                'tag_id' => $this->childTag->id,
                'locale' => $locale,
                'name' => $name,
                'slug' => 'rock',
            ]);
        }
    }
}
