<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        if ($this->has('parent_id') && $this->input('parent_id') !== null) {
            return [
                'name_es' => 'required|string|max:255',
                'name_pt' => 'required|string|max:255',
                'parent_id' => 'nullable|integer|exists:categories,id',
            ];
        }

        return [
            'name_es' => 'required|string|max:255',
            'name_pt' => 'required|string|max:255',
            'parent_id' => 'nullable|integer|exists:categories,id',
            'image' => 'required_if:featured_image,null',
            'featured_image' => 'required_if:image,==,null',
            'color' => 'required_if:parent_id,null|nullable|string|max:255',
            'icon' => [
                'required_if:icon_image,==,null',
            ],
            'icon_image' => [
                'required_if:icon,==,null',
                'nullable',
                'image',
                'max:1024',
                'mimes:png,svg',
            ],
        ];
    }
}
