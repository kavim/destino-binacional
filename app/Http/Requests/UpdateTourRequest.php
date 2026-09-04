<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesGalleryUpload;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTourRequest extends FormRequest
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
            'title' => 'required|max:255',
            'meeting_point' => 'required|max:255',
            'start' => 'nullable',
            'end' => 'nullable',
            'price' => 'nullable',
            'currency' => 'nullable',
            'description' => 'required|max:9999',
            'guide' => 'required|max:255',
            'google_maps_src' => 'nullable',
            'featured_image' => 'nullable',
            'category_ids' => 'nullable',
            'recurrence_enabled' => 'nullable|boolean',
            'recurrence_day_hour' => 'nullable|array',
        ], $this->galleryValidationRules());
    }
}
