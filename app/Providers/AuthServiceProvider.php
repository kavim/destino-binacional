<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Event;
use App\Models\ObservabilityPageView;
use App\Models\Place;
use App\Models\Tag;
use App\Models\Tour;
use App\Models\User;
use App\Policies\CategoryPolicy;
use App\Policies\EventPolicy;
use App\Policies\ObservabilityPageViewPolicy;
use App\Policies\PlacePolicy;
use App\Policies\TagPolicy;
use App\Policies\TourPolicy;
use App\Policies\UserPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Place::class => PlacePolicy::class,
        Event::class => EventPolicy::class,
        Tour::class => TourPolicy::class,
        Category::class => CategoryPolicy::class,
        Tag::class => TagPolicy::class,
        ObservabilityPageView::class => ObservabilityPageViewPolicy::class,
        User::class => UserPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
