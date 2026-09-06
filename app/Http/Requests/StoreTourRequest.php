<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesGalleryUpload;
use App\Models\Tour;
use Illuminate\Foundation\Http\FormRequest;

class StoreTourRequest extends FormRequest
{
    use ValidatesGalleryUpload;

    public function authorize(): bool
    {
        return $this->user()?->can('create', Tour::class) ?? false;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge([
            'title' => 'required|max:255',
            'meeting_point' => 'required|max:255',
            'start' => 'nullable',
            'end' => 'nullable',
            'price' => 'nullable',
            'currency' => 'nullable|in:BRL,UYU',
            'description' => 'required|max:9999',
            'guide' => 'required|max:255',
            'google_maps_src' => 'nullable',
            'featured_image' => 'required',
            'category_ids' => ['nullable'],
        ], $this->galleryValidationRules());
    }
}
