<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PlaceImage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['place_id', 'url', 'title'];

    public function getUrl()
    {
        if (substr($this->url, 0, 4) === 'http') {
            return $this->url;
        }

        if (substr($this->url, 0, 6) === 'places') {
            return asset('/storage/'.$this->url);
        }

        return asset('/storage/places/'.$this->url);
    }
}
