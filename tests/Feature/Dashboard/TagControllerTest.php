<?php

namespace Tests\Feature\Dashboard;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Tests\Traits\SeedsTestData;

class TagControllerTest extends TestCase
{
    use RefreshDatabase, SeedsTestData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedTestData();
    }

    public function test_admin_can_view_tags_index(): void
    {
        $this->actingAs($this->user)->get('/tags')->assertOk();
    }

    public function test_tag_create_route_does_not_exist(): void
    {
        $this->actingAs($this->user)->get('/tags/create')->assertNotFound();
    }
}
