<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObservabilityPerformance extends Model
{
    protected $table = 'observability_performance';

    protected $fillable = [
        'path',
        'method',
        'route_name',
        'duration_ms',
        'memory_bytes',
        'status_code',
        'measured_at',
    ];

    protected $casts = [
        'measured_at' => 'datetime',
    ];
}
