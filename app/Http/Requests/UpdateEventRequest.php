<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesGalleryUpload;
use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    use ValidatesGalleryUpload;

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge([
            'title' => ['required'],
            'description' => ['required'],
            'start' => ['required'],
            'end' => ['required'],
            'is_online' => ['required'],
            'link' => ['required_if:is_online,true'],
            'google_maps_src' => ['required_if:is_online,false'],
            'address' => ['required_if:is_online,false'],
            'city_id' => ['required_if:is_online,false'],
            'category_id' => ['nullable'],
            'image' => 'required_if:featured_image,null',
            'featured_image' => 'required_if:image,==,null',
            'tag_ids' => ['required', 'array'],
        ], $this->galleryValidationRules());
    }
}
