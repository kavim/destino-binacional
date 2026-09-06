<?php

namespace Tests\Feature\Api;

use Tests\TestCase;

class ImportPlacesTest extends TestCase
{
    public function test_import_places_route_is_gone(): void
    {
        $this->postJson('/api/import-places', [])
            ->assertNotFound();
    }
}
