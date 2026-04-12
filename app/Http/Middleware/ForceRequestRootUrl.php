<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Symfony\Component\HttpFoundation\Response;

class ForceRequestRootUrl
{
    /**
     * Garante que url() / asset() usam o host e o path base do pedido atual
     * (útil quando APP_URL no .env não coincide com como se acede à app em dev).
     */
    public function handle(Request $request, Closure $next): Response
    {
        URL::forceRootUrl($request->root());

        return $next($request);
    }
}
