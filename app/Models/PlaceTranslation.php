<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlaceTranslation extends Model
{
    use HasFactory;

    protected $fillable = ['place_id', 'locale', 'description'];
}
