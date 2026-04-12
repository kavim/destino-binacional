<?php

namespace Tests\Unit\Models;

use App\Models\Tour;
use Tests\TestCase;

class TourTest extends TestCase
{
    public function test_fillable_attributes_are_defined(): void
    {
        $tour = new Tour;

        $this->assertContains('title', $tour->getFillable());
        $this->assertContains('slug', $tour->getFillable());
        $this->assertContains('price', $tour->getFillable());
        $this->assertContains('currency', $tour->getFillable());
        $this->assertContains('guide', $tour->getFillable());
    }

    public function test_google_maps_src_is_cast_to_array(): void
    {
        $tour = new Tour;
        $casts = $tour->getCasts();

        $this->assertArrayHasKey('google_maps_src', $casts);
        $this->assertSame('array', $casts['google_maps_src']);
    }

    public function test_recurrence_day_hour_is_cast_to_array(): void
    {
        $tour = new Tour;
        $casts = $tour->getCasts();

        $this->assertArrayHasKey('recurrence_day_hour', $casts);
        $this->assertSame('array', $casts['recurrence_day_hour']);
    }

    public function test_image_accessor_returns_placeholder_when_null(): void
    {
        $tour = new Tour(['featured_image' => null]);

        $this->assertStringContainsString('parque.webp', $tour->image);
    }
}
