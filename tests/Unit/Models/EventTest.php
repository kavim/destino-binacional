<?php

namespace Tests\Unit\Models;

use App\Models\Event;
use PHPUnit\Framework\TestCase;

class EventTest extends TestCase
{
    public function test_fillable_attributes_are_defined(): void
    {
        $event = new Event;

        $this->assertContains('title', $event->getFillable());
        $this->assertContains('slug', $event->getFillable());
        $this->assertContains('description', $event->getFillable());
        $this->assertContains('start', $event->getFillable());
        $this->assertContains('end', $event->getFillable());
        $this->assertContains('is_online', $event->getFillable());
        $this->assertContains('featured_image', $event->getFillable());
    }

    public function test_is_online_is_cast_to_boolean(): void
    {
        $event = new Event;
        $casts = $event->getCasts();

        $this->assertArrayHasKey('is_online', $casts);
        $this->assertSame('boolean', $casts['is_online']);
    }

    public function test_start_and_end_are_cast_to_date(): void
    {
        $event = new Event;
        $casts = $event->getCasts();

        $this->assertArrayHasKey('start', $casts);
        $this->assertArrayHasKey('end', $casts);
    }

    public function test_image_accessor_returns_placeholder_when_null(): void
    {
        $event = new Event(['featured_image' => null]);

        $this->assertStringContainsString('lorem.space', $event->image);
    }
}
