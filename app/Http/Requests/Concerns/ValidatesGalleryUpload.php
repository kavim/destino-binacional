<?php

namespace App\Http\Requests\Concerns;

trait ValidatesGalleryUpload
{
    /**
     * @return array<string, mixed>
     */
    protected function galleryValidationRules(): array
    {
        $maxKb = config('custom.gallery_limits.max_file_size_kb', 10240);
        $maxFiles = config('custom.gallery_limits.max_files', 30);

        return [
            'gallery_new' => ['nullable', 'array', 'max:'.$maxFiles],
            'gallery_new.*' => ['image', 'mimes:jpeg,jpg,png,webp,gif,bmp', 'max:'.$maxKb],
            'gallery_new_keys' => ['nullable', 'array'],
            'gallery_new_keys.*' => ['nullable', 'string', 'max:64'],
            'gallery_order' => ['nullable', 'json'],
            'gallery_remove_ids' => ['nullable', 'array'],
            'gallery_remove_ids.*' => ['integer'],
        ];
    }
}
