<?php

namespace Tests\Unit\Http\Middleware;

use App\Http\Middleware\TrustProxies;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class TrustProxiesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config([
            'trustedproxy.proxies' => '10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,127.0.0.1,::1',
        ]);
    }

    public function test_config_does_not_trust_all_proxies(): void
    {
        $proxies = config('trustedproxy.proxies');

        $this->assertIsString($proxies);
        $this->assertNotSame('*', trim($proxies));
        $this->assertNotContains('*', array_map('trim', explode(',', $proxies)));
    }

    public function test_forwarded_for_from_untrusted_client_is_ignored(): void
    {
        $request = Request::create('http://example.test/', 'GET', [], [], [], [
            'REMOTE_ADDR' => '203.0.113.50',
        ]);
        $request->headers->set('X-Forwarded-For', '198.51.100.1');

        $resolved = $this->throughTrustProxies($request);

        $this->assertSame('203.0.113.50', $resolved->ip());
    }

    public function test_docker_bridge_proxy_honors_forwarded_proto_and_for(): void
    {
        $request = Request::create('http://destinobinacional.com/', 'GET', [], [], [], [
            'REMOTE_ADDR' => '172.18.0.5',
        ]);
        $request->headers->set('X-Forwarded-Proto', 'https');
        $request->headers->set('X-Forwarded-For', '198.51.100.20');

        $resolved = $this->throughTrustProxies($request);

        $this->assertTrue($resolved->secure());
        $this->assertSame('198.51.100.20', $resolved->ip());
    }

    private function throughTrustProxies(Request $request): Request
    {
        $captured = null;

        (new TrustProxies)->handle($request, function (Request $req) use (&$captured): Response {
            $captured = $req;

            return response('ok');
        });

        $this->assertInstanceOf(Request::class, $captured);

        return $captured;
    }
}
