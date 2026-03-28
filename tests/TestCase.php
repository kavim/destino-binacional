<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        $this->guardAgainstRealDatabase();
    }

    /**
     * Abort the test suite immediately if connected to a real (non-SQLite)
     * database to prevent accidental data loss.
     */
    private function guardAgainstRealDatabase(): void
    {
        $connection = config('database.default');

        if ($connection !== 'sqlite') {
            $this->fail(
                "SAFETY: Tests are running against [{$connection}] instead of [sqlite]. "
                . 'Aborting to protect your data. Check phpunit.xml and .env.testing.'
            );
        }
    }
}
