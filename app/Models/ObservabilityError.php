<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObservabilityError extends Model
{
    protected $table = 'observability_errors';

    protected $fillable = [
        'source',
        'message',
        'url',
        'file',
        'line',
        'context',
        'level',
    ];

    protected $casts = [
        'context' => 'array',
    ];
}
