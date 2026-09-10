<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\Category;
use App\Models\Event;
use App\Models\Place;
use App\Models\Tour;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * @var array<string, string>
     */
    private const SUBJECT_TYPE_MAP = [
        'place' => Place::class,
        'event' => Event::class,
        'tour' => Tour::class,
        'category' => Category::class,
        'user' => User::class,
    ];

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', ActivityLog::class);

        $action = $request->string('action')->toString();
        $subjectKey = $request->string('subject_type')->toString();
        $search = $request->string('search')->toString();

        $logs = ActivityLog::query()
            ->with('user:id,name,email')
            ->when(
                $action !== '' && in_array($action, ActivityLog::ACTIONS, true),
                fn ($query) => $query->where('action', $action),
            )
            ->when(
                $subjectKey !== '' && isset(self::SUBJECT_TYPE_MAP[$subjectKey]),
                fn ($query) => $query->where('subject_type', self::SUBJECT_TYPE_MAP[$subjectKey]),
            )
            ->when(
                $search !== '',
                fn ($query) => $query->where('subject_label', 'like', '%'.$search.'%'),
            )
            ->latest('id')
            ->paginate(25)
            ->withQueryString()
            ->through(fn (ActivityLog $log) => [
                'id' => $log->id,
                'action' => $log->action,
                'subject_type' => $log->subjectKey(),
                'subject_id' => $log->subject_id,
                'subject_label' => $log->subject_label,
                'created_at' => $log->created_at?->toIso8601String(),
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
            ]);

        return Inertia::render('Dashboard/ActivityLog/Index', [
            'logs' => $logs,
            'filters' => [
                'search' => $search !== '' ? $search : null,
                'action' => $action !== '' ? $action : null,
                'subject_type' => $subjectKey !== '' ? $subjectKey : null,
            ],
        ]);
    }
}
