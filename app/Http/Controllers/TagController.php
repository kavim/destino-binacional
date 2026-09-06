<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use App\Services\TagService;
use Inertia\Inertia;

class TagController extends Controller
{
    public function __construct(
        protected TagService $tagService,
    ) {
        $this->authorizeResource(Tag::class);
    }

    public function index()
    {
        $tags = $this->tagService->index();
        $grouped = $this->tagService->groupedByParentId();

        return Inertia::render('Dashboard/Tag/Index', [
            'parent_tags' => $tags,
            'grouped_tags' => $grouped,
        ]);
    }
}
