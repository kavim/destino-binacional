# 📸 Exemplo: Usando Imagens do Filament no Frontend Inertia.js

## Como acessar as imagens salvas pelo Filament no seu frontend público

Depois de configurar o Spatie Media Library e o Filament, você pode acessar as imagens normalmente nos seus controllers e views Inertia.js.

---

## 1. Atualizar o Model Place

```php
<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
// ... outros imports ...

class Place extends Model implements HasMedia, TranslatableContract
{
    use HasFactory, SoftDeletes, Translatable, InteractsWithMedia;

    // ... código existente ...

    // Accessors para facilitar o uso no frontend
    public function getThumbnailAttribute(): ?string
    {
        return $this->getFirstMediaUrl('thumbnail', 'thumb') 
            ?: $this->getFirstMediaUrl('featured', 'thumb')
            ?: 'https://api.lorem.space/image/burger?w=300&h=300';
    }

    public function getFeaturedImageAttribute(): ?string
    {
        return $this->getFirstMediaUrl('featured', 'featured')
            ?: $this->getFirstMediaUrl('cover', 'featured')
            ?: 'https://api.lorem.space/image/burger?w=1280&h=720';
    }

    public function getCoverImageAttribute(): ?string
    {
        return $this->getFirstMediaUrl('cover', 'cover')
            ?: $this->getFirstMediaUrl('featured', 'cover')
            ?: 'https://api.lorem.space/image/burger?w=1920&h=1080';
    }

    // Relacionamento com imagens da galeria
    public function galleryImages()
    {
        return $this->getMedia('gallery');
    }

    // Helper para retornar array de imagens da galeria
    public function getGalleryAttribute(): array
    {
        return $this->getMedia('gallery')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb' => $media->getUrl('thumb'),
                'featured' => $media->getUrl('featured'),
                'name' => $media->name,
            ];
        })->toArray();
    }
}
```

---

## 2. Usar no Controller (Inertia.js)

```php
<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\Place;
use Inertia\Inertia;

class PlaceController extends Controller
{
    public function getByPlaceIdentifier(string $slug)
    {
        $place = Place::where('slug', $slug)
            ->with(['city', 'placeType', 'categories'])
            ->firstOrFail();

        return Inertia::render('Site/Place/Show', [
            'place' => [
                'id' => $place->id,
                'name' => $place->name,
                'slug' => $place->slug,
                'address' => $place->address,
                'description_pt' => $place->description_pt,
                'description_es' => $place->description_es,
                
                // Imagens usando os accessors
                'thumbnail' => $place->thumbnail,
                'featured_image' => $place->featured_image,
                'cover_image' => $place->cover_image,
                'gallery' => $place->gallery, // Array de imagens
                
                // Relacionamentos
                'city' => $place->city,
                'place_type' => $place->placeType,
                'categories' => $place->categories,
            ],
        ]);
    }
}
```

---

## 3. Usar no Componente React (Inertia.js)

```jsx
// resources/js/Pages/Site/Place/Show.jsx

import React from 'react';
import { Head } from '@inertiajs/react';
import SiteLayout from '@/Layouts/SiteLayout';

export default function PlaceShow({ place }) {
    return (
        <SiteLayout>
            <Head title={place.name} />
            
            {/* Cover Image (Header) */}
            <div className="relative h-96 w-full overflow-hidden">
                <img 
                    src={place.cover_image} 
                    alt={place.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h1 className="text-4xl font-bold text-white">{place.name}</h1>
                </div>
            </div>

            {/* Featured Image (seção principal) */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <img 
                            src={place.featured_image} 
                            alt={place.name}
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">Sobre</h2>
                        <div 
                            dangerouslySetInnerHTML={{ __html: place.description_pt }} 
                        />
                    </div>
                </div>

                {/* Galeria de Imagens */}
                {place.gallery && place.gallery.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">Galeria</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {place.gallery.map((image, index) => (
                                <div key={image.id || index} className="relative group">
                                    <img 
                                        src={image.thumb} 
                                        alt={`${place.name} - Imagem ${index + 1}`}
                                        className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-75 transition"
                                        onClick={() => {
                                            // Abrir modal com imagem em tamanho grande
                                            window.open(image.url, '_blank');
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SiteLayout>
    );
}
```

---

## 4. Usar em Listagens (Index)

```php
// app/Http/Controllers/Site/PlaceController.php

public function getByCategoryParentID(string $categoryIdentifier)
{
    $category = Category::whereHas('translations', function ($query) use ($categoryIdentifier) {
        $query->where('slug', $categoryIdentifier);
    })->firstOrFail();

    $places = Place::whereHas('categories', function ($query) use ($category) {
        $query->where('categories.id', $category->id);
    })
    ->orderBy('order')
    ->paginate(12);

    return Inertia::render('Site/Place/Category', [
        'category' => $category,
        'places' => $places->through(function ($place) {
            return [
                'id' => $place->id,
                'name' => $place->name,
                'slug' => $place->slug,
                'address' => $place->address,
                'thumbnail' => $place->thumbnail, // Usa thumbnail para listagens
                'city' => $place->city?->name,
            ];
        }),
    ]);
}
```

```jsx
// resources/js/Pages/Site/Place/Category.jsx

export default function CategoryShow({ category, places }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {places.data.map((place) => (
                <div key={place.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* Thumbnail - otimizada para listagens */}
                    <img 
                        src={place.thumbnail} 
                        alt={place.name}
                        className="w-full h-48 object-cover"
                        loading="lazy" // Lazy loading nativo
                    />
                    <div className="p-4">
                        <h3 className="text-xl font-bold">{place.name}</h3>
                        <p className="text-gray-600">{place.address}</p>
                        <p className="text-sm text-gray-500">{place.city}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
```

---

## 5. API Response (se usar API)

```php
// app/Http/Controllers/Api/PlaceController.php

public function show(Place $place)
{
    return response()->json([
        'id' => $place->id,
        'name' => $place->name,
        'slug' => $place->slug,
        'images' => [
            'thumbnail' => $place->thumbnail,
            'featured' => $place->featured_image,
            'cover' => $place->cover_image,
            'gallery' => $place->gallery,
        ],
        // ... outros campos
    ]);
}
```

---

## 6. Componente Reutilizável de Galeria

```jsx
// resources/js/Components/ImageGallery.jsx

import React, { useState } from 'react';

export default function ImageGallery({ images, featuredImage }) {
    const [selectedImage, setSelectedImage] = useState(featuredImage || images[0]?.url);

    return (
        <div className="space-y-4">
            {/* Imagem Principal */}
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
                <img 
                    src={selectedImage} 
                    alt="Imagem selecionada"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Thumbnails */}
            {images && images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <button
                            key={image.id || index}
                            onClick={() => setSelectedImage(image.url)}
                            className={`relative h-20 rounded overflow-hidden border-2 ${
                                selectedImage === image.url 
                                    ? 'border-blue-500' 
                                    : 'border-transparent'
                            }`}
                        >
                            <img 
                                src={image.thumb} 
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
```

Uso:

```jsx
<ImageGallery 
    images={place.gallery} 
    featuredImage={place.featured_image}
/>
```

---

## 7. Otimizações de Performance

### Lazy Loading de Imagens

```jsx
<img 
    src={place.thumbnail} 
    alt={place.name}
    loading="lazy"
    decoding="async"
/>
```

### Picture Element (Responsive Images)

```jsx
<picture>
    <source 
        media="(min-width: 1024px)" 
        srcSet={place.cover_image}
    />
    <source 
        media="(min-width: 768px)" 
        srcSet={place.featured_image}
    />
    <img 
        src={place.thumbnail} 
        alt={place.name}
        className="w-full h-auto"
    />
</picture>
```

---

## 8. Migração de Dados Existentes

Se você já tem imagens no formato antigo (`featured_image` como string), pode criar um comando para migrar:

```php
// app/Console/Commands/MigratePlaceImages.php

namespace App\Console\Commands;

use App\Models\Place;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;

class MigratePlaceImages extends Command
{
    protected $signature = 'places:migrate-images';
    protected $description = 'Migra imagens antigas para Media Library';

    public function handle()
    {
        $places = Place::whereNotNull('featured_image')->get();

        foreach ($places as $place) {
            $oldPath = storage_path('app/public/places/' . $place->featured_image);
            
            if (file_exists($oldPath)) {
                $place->addMedia($oldPath)
                    ->toMediaCollection('featured');
                
                $this->info("Migrated: {$place->name}");
            }
        }

        $this->info('Migration completed!');
    }
}
```

---

## ✅ Resumo

1. **Filament salva** → Spatie Media Library (banco de dados)
2. **Model Place** → Accessors para facilitar acesso
3. **Controllers** → Passam imagens para Inertia
4. **Frontend React** → Usa normalmente como antes
5. **Vantagem**: Múltiplas imagens, tamanhos otimizados, galeria completa!

---

**Agora você tem o melhor dos dois mundos:**
- ✅ Admin poderoso (Filament)
- ✅ Frontend customizado (Inertia.js)
- ✅ Sistema de imagens profissional
