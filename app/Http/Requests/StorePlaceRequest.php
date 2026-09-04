<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesGalleryUpload;
use Illuminate\Foundation\Http\FormRequest;

class StorePlaceRequest extends FormRequest
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
            'name' => 'required|max:255',
            'address' => 'required|max:255',
            'city_id' => 'required|exists:cities,id',
            'place_type_id' => 'required|exists:place_types,id',
            'description_pt' => 'required|max:9999',
            'description_es' => 'required|max:9999',
            'google_maps_src' => 'nullable',
            'featured_image' => 'required',
            'order' => 'required|numeric|min:0|max:9999',
            'category_ids' => ['nullable'],
        ], $this->galleryValidationRules());
    }
}
