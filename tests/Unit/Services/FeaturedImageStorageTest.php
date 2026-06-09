<?php

namespace Tests\Unit\Services;

use App\Services\FeaturedImageStorage;
use RuntimeException;
use Tests\TestCase;

class FeaturedImageStorageTest extends TestCase
{
    private FeaturedImageStorage $storage;

    private string $base64Pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    protected function setUp(): void
    {
        parent::setUp();
        $this->storage = new FeaturedImageStorage;
    }

    public function test_store_from_base64_returns_null_for_empty_input(): void
    {
        $this->assertNull($this->storage->storeFromBase64(null, [
            'path' => 'events/',
            'prefix' => 'event_',
        ]));
        $this->assertNull($this->storage->storeFromBase64('', [
            'path' => 'events/',
            'prefix' => 'event_',
        ]));
    }

    public function test_store_from_base64_saves_file_on_public_disk(): void
    {
        $filename = $this->storage->storeFromBase64($this->base64Pixel, [
            'path' => 'events/',
            'prefix' => 'event_',
        ]);

        $this->assertNotNull($filename);
        $this->assertStringStartsWith('event_', $filename);
        $this->assertFileExists(storage_path('app/public/events/'.$filename));

        @unlink(storage_path('app/public/events/'.$filename));
    }

    public function test_store_from_base64_throws_on_invalid_data_uri(): void
    {
        $this->expectException(RuntimeException::class);

        $this->storage->storeFromBase64('not-a-data-uri', [
            'path' => 'events/',
            'prefix' => 'event_',
        ]);
    }

    public function test_store_from_base64_throws_on_invalid_base64_payload(): void
    {
        $this->expectException(RuntimeException::class);

        $this->storage->storeFromBase64('data:image/png;base64,%%%', [
            'path' => 'events/',
            'prefix' => 'event_',
        ]);
    }

    public function test_store_from_base64_can_force_output_format(): void
    {
        $filename = $this->storage->storeFromBase64($this->base64Pixel, [
            'path' => 'events/',
            'prefix' => 'event_',
            'output_format' => 'jpg',
        ]);

        $this->assertNotNull($filename);
        $this->assertStringEndsWith('.jpg', $filename);
        $this->assertFileExists(storage_path('app/public/events/'.$filename));

        @unlink(storage_path('app/public/events/'.$filename));
    }
}
