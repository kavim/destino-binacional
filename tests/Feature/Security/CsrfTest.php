<?php

namespace Tests\Feature\Security;

use App\Http\Middleware\VerifyCsrfToken;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CsrfTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // PHPUnit skips CSRF via runningUnitTests(); bind a copy that actually checks tokens.
        $this->app->bind(VerifyCsrfToken::class, CsrfEnforcingVerifyToken::class);
    }

    public function test_csrf_except_list_has_no_wildcard(): void
    {
        $middleware = $this->app->make(VerifyCsrfToken::class);

        $this->assertNotContains('*', $middleware->getExcludedPaths());
        $this->assertSame([], $middleware->getExcludedPaths());
    }

    public function test_authenticated_post_without_csrf_token_returns_419(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->post('/logout')
            ->assertStatus(419);
    }

    public function test_authenticated_post_with_csrf_token_is_not_419(): void
    {
        $user = User::factory()->admin()->create();

        $this->actingAs($user)->get('/places/create')->assertOk();

        $response = $this->actingAs($user)
            ->post('/places', ['_token' => session()->token()]);

        $this->assertNotSame(419, $response->status());
        $response->assertRedirect();
    }

    public function test_login_with_csrf_token_still_authenticates(): void
    {
        $user = User::factory()->create();

        $this->get('/login')->assertOk();

        $this->post('/login', [
            '_token' => session()->token(),
            'email' => $user->email,
            'password' => 'password',
        ])->assertRedirect();

        $this->assertAuthenticatedAs($user);
    }

    public function test_api_observability_errors_does_not_require_csrf(): void
    {
        $this->postJson('/api/observability/errors', [
            'message' => 'client error for csrf spec',
        ])->assertCreated();
    }
}

class CsrfEnforcingVerifyToken extends VerifyCsrfToken
{
    protected function runningUnitTests()
    {
        return false;
    }
}
