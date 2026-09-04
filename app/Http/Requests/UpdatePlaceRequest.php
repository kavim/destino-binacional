<?php

namespace App\Http\Requests;

use App\Http\Requests\Concerns\ValidatesGalleryUpload;
use App\Models\Place;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePlaceRequest extends FormRequest
{
    use ValidatesGalleryUpload;

    public function authorize(): bool
    {
        $place = $this->route('place');

        return $place instanceof Place
            && ($this->user()?->can('update', $place) ?? false);
    }

    protected function prepareForValidation(): void
    {
        $place = $this->route('place');

        if ($place instanceof Place && ! $this->filled('place_type_id') && $place->place_type_id) {
            $this->merge(['place_type_id' => $place->place_type_id]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return array_merge([
            'name' => 'required',
            'address' => 'required',
            'city_id' => 'required',
            'place_type_id' => 'required',
            'description_pt' => 'required',
            'description_es' => 'required',
            'google_maps_src' => 'nullable',
            'featured_image' => 'required_if:current_image,==,null',
            'image' => 'required_if:featured_image,==,null',
            'category_ids' => ['required', 'array', 'min:1'],
            'category_ids.*' => ['required', 'exists:categories,id'],
        ], $this->galleryValidationRules());
    }
}
