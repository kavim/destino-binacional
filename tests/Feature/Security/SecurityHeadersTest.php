<?php

namespace Tests\Feature\Security;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityHeadersTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_home_sends_report_only_csp_and_security_headers(): void
    {
        $response = $this->get('/');

        $response->assertOk();
        $this->assertSecurityHeaders($response->headers->all());
    }

    public function test_authenticated_dashboard_sends_report_only_csp(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->get('/dashboard');

        $response->assertOk();
        $this->assertSecurityHeaders($response->headers->all());
    }

    /**
     * @param  array<string, array<int, string>|string>  $headers
     */
    private function assertSecurityHeaders(array $headers): void
    {
        $csp = $this->headerValue($headers, 'content-security-policy-report-only');

        $this->assertNotSame('', $csp);
        $this->assertStringContainsString("default-src 'self'", $csp);
        $this->assertStringContainsString('script-src', $csp);
        $this->assertStringContainsString('style-src', $csp);
        $this->assertStringContainsString('img-src', $csp);
        $this->assertStringContainsString('connect-src', $csp);
        $this->assertStringContainsString('frame-src', $csp);
        $this->assertStringContainsString('font-src', $csp);
        $this->assertArrayNotHasKey('content-security-policy', $headers);

        $this->assertSame(
            'strict-origin-when-cross-origin',
            $this->headerValue($headers, 'referrer-policy')
        );
        $this->assertStringContainsString(
            'camera=()',
            $this->headerValue($headers, 'permissions-policy')
        );
        $this->assertStringContainsString(
            'microphone=()',
            $this->headerValue($headers, 'permissions-policy')
        );
    }

    /**
     * @param  array<string, array<int, string>|string>  $headers
     */
    private function headerValue(array $headers, string $name): string
    {
        $value = $headers[$name] ?? $headers[strtolower($name)] ?? '';

        return is_array($value) ? (string) ($value[0] ?? '') : (string) $value;
    }
}
