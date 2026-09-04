<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Place;
use App\Models\Tour;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function xml(): Response
    {
        $urls = [
            ['loc' => url('/')],
            ['loc' => route('site.events.index')],
            ['loc' => route('site.tours.index')],
        ];

        Place::query()
            ->orderBy('id')
            ->pluck('slug')
            ->each(function (string $slug) use (&$urls) {
                $urls[] = ['loc' => route('places.byPlaceIdentifier', $slug)];
            });

        Tour::query()
            ->orderBy('id')
            ->pluck('slug')
            ->each(function (string $slug) use (&$urls) {
                $urls[] = ['loc' => route('site.tours.show', $slug)];
            });

        Event::query()
            ->whereDate('end', '>=', now()->toDateString())
            ->orderBy('id')
            ->pluck('slug')
            ->each(function (string $slug) use (&$urls) {
                $urls[] = ['loc' => route('site.events.show', $slug)];
            });

        return response()
            ->view('sitemap', ['urls' => $urls])
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    public function robots(): Response
    {
        $sitemap = rtrim((string) config('app.url'), '/').'/sitemap.xml';
        $body = "User-agent: *\nDisallow:\n\nSitemap: {$sitemap}\n";

        return response($body, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
