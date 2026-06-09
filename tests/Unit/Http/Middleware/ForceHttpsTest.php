<?php

namespace Tests\Unit\Http\Middleware;

use App\Http\Middleware\ForceHttps;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class ForceHttpsTest extends TestCase
{
    private function trustedRequest(string $uri, string $forwardedProto): Request
    {
        $request = Request::create($uri, 'GET');
        $request->headers->set('X-Forwarded-Proto', $forwardedProto);
        $request->setTrustedProxies(['*'], Request::HEADER_X_FORWARDED_PROTO);

        return $request;
    }

    public function test_redirects_insecure_requests_to_https(): void
    {
        Config::set('app.force_https', true);

        $middleware = new ForceHttps;
        $response = $middleware->handle(
            $this->trustedRequest('http://destinobinacional.com/?utm_source=ig', 'http'),
            fn (): Response => response('ok')
        );

        $this->assertSame(301, $response->getStatusCode());
        $this->assertStringStartsWith('https://', $response->headers->get('Location'));
    }

    public function test_adds_hsts_header_on_secure_requests(): void
    {
        Config::set('app.force_https', true);

        $middleware = new ForceHttps;
        $response = $middleware->handle(
            $this->trustedRequest('https://destinobinacional.com/', 'https'),
            fn (): Response => response('ok')
        );

        $this->assertSame(200, $response->getStatusCode());
        $this->assertSame(
            'max-age=31536000; includeSubDomains; preload',
            $response->headers->get('Strict-Transport-Security')
        );
    }

    public function test_does_not_force_https_when_disabled(): void
    {
        Config::set('app.force_https', false);
        Config::set('app.env', 'local');

        $middleware = new ForceHttps;
        $response = $middleware->handle(
            $this->trustedRequest('http://destinobinacional.com/', 'http'),
            fn (): Response => response('ok')
        );

        $this->assertSame(200, $response->getStatusCode());
        $this->assertNull($response->headers->get('Strict-Transport-Security'));
    }
}
