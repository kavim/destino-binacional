<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ActivityLog extends Model
{
    public const ACTION_CREATED = 'created';

    public const ACTION_UPDATED = 'updated';

    public const ACTION_DELETED = 'deleted';

    /**
     * @var list<string>
     */
    public const ACTIONS = [
        self::ACTION_CREATED,
        self::ACTION_UPDATED,
        self::ACTION_DELETED,
    ];

    /**
     * @var array<string, string>
     */
    public const SUBJECT_KEYS = [
        Place::class => 'place',
        Event::class => 'event',
        Tour::class => 'tour',
        Category::class => 'category',
        User::class => 'user',
    ];

    protected $fillable = [
        'user_id',
        'action',
        'subject_type',
        'subject_id',
        'subject_label',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function subjectKey(): string
    {
        return self::SUBJECT_KEYS[$this->subject_type] ?? class_basename($this->subject_type);
    }
}
