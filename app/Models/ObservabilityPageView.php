<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ObservabilityPageView extends Model
{
    protected $table = 'observability_page_views';

    protected $fillable = [
        'path',
        'method',
        'route_name',
        'ip',
        'ip_hash',
        'user_id',
        'user_agent',
        'referer',
        'country',
        'country_code',
        'region',
        'city',
        'timezone',
        'viewed_at',
    ];

    protected $casts = [
        'viewed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
