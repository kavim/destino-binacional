<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesGalleryUpload;
use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    use ValidatesGalleryUpload;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Event::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge([
            'title' => 'required',
            'description' => 'required',
            'start' => 'required',
            'end' => 'required',
            'is_online' => 'required',
            'link' => 'required_if:is_online,true',
            'google_maps_src' => 'required_if:is_online,false',
            'address' => 'required_if:is_online,false',
            'city_id' => 'required_if:is_online,false',
            'category_id' => 'nullable',
            'featured_image' => 'required',
            'tag_ids' => 'required',
        ], $this->galleryValidationRules());
    }
}
