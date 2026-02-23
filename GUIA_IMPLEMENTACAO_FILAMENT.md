# 🚀 Guia de Implementação: Filament + Inertia.js em Paralelo

## ✅ É TOTALMENTE POSSÍVEL!

Você pode ter:
- **Frontend Público**: Inertia.js (rotas `/`, `/p/{slug}`, `/eventos`, etc)
- **Admin Antigo**: Inertia.js (rotas `/dashboard`, `/places`, `/events`, etc) - **MANTER**
- **Admin Novo**: Filament (rotas `/admin/*`) - **ADICIONAR**

Ambos compartilham a mesma autenticação e banco de dados!

---

## 📋 Passo a Passo da Implementação

### **Fase 1: Instalação do Filament**

#### 1.1 Instalar via Composer

```bash
composer require filament/filament:"^3.2" -W
```

#### 1.2 Instalar o Painel Admin

```bash
php artisan filament:install --panels
```

Quando perguntar:
- **Panel ID**: `admin` (isso criará rotas `/admin/*`)
- **Model**: `App\Models\User`
- **Username column**: `email`
- **Password column**: `password`

#### 1.3 Publicar Assets (opcional, para customização)

```bash
php artisan filament:assets
```

---

### **Fase 2: Configuração de Rotas Separadas**

#### 2.1 Estrutura de Rotas Final

```
/                    → Inertia.js (Site público)
/dashboard           → Inertia.js (Admin antigo - MANTER)
/places              → Inertia.js (Admin antigo - MANTER)
/events              → Inertia.js (Admin antigo - MANTER)
/admin               → Filament (Admin novo - ADICIONAR)
/admin/places        → Filament (Admin novo)
/admin/events        → Filament (Admin novo)
```

#### 2.2 Configurar Filament para usar prefixo `/admin`

O Filament já faz isso automaticamente quando você usa `--panels` e escolhe `admin` como Panel ID.

#### 2.3 Verificar Configuração do Filament

O arquivo `config/filament.php` será criado. Verifique se está assim:

```php
'panels' => [
    'admin' => [
        'path' => 'admin',
        // ...
    ],
],
```

---

### **Fase 3: Autenticação Compartilhada**

#### 3.1 O Filament usa a mesma autenticação do Laravel

Por padrão, o Filament usa o guard `web` e o provider `users`, que é o mesmo do seu projeto atual. **Não precisa fazer nada!**

#### 3.2 (Opcional) Criar um Provider Customizado

Se quiser ter usuários diferentes para admin, você pode criar um guard separado, mas **não é necessário**.

---

### **Fase 4: Criar Primeiro Resource (Place)**

#### 4.1 Gerar Resource

```bash
php artisan make:filament-resource Place --generate
```

Isso criará:
- `app/Filament/Resources/PlaceResource.php`
- `app/Filament/Resources/PlaceResource/Pages/`
- `app/Filament/Resources/PlaceResource/RelationManagers/`

#### 4.2 Exemplo de PlaceResource Completo

```php
<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PlaceResource\Pages;
use App\Models\Place;
use App\Models\City;
use App\Models\PlaceType;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;

class PlaceResource extends Resource
{
    protected static ?string $model = Place::class;

    protected static ?string $navigationIcon = 'heroicon-o-map-pin';
    
    protected static ?string $navigationLabel = 'Lugares';
    
    protected static ?string $navigationGroup = 'Conteúdo';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Informações Básicas')
                    ->schema([
                        Forms\Components\TextInput::make('name')
                            ->label('Nome')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, Forms\Set $set) => 
                                $set('slug', \Illuminate\Support\Str::slug($state))
                            ),
                        
                        Forms\Components\TextInput::make('slug')
                            ->label('Slug')
                            ->required()
                            ->maxLength(255)
                            ->unique(ignoreRecord: true),
                        
                        Forms\Components\Textarea::make('address')
                            ->label('Endereço')
                            ->required()
                            ->rows(2),
                        
                        Forms\Components\Select::make('city_id')
                            ->label('Cidade')
                            ->relationship('city', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        
                        Forms\Components\Select::make('place_type_id')
                            ->label('Tipo de Lugar')
                            ->relationship('placeType', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),
                        
                        Forms\Components\TextInput::make('order')
                            ->label('Ordem')
                            ->numeric()
                            ->default(0)
                            ->required(),
                    ])->columns(2),
                
                Forms\Components\Section::make('Imagens')
                    ->schema([
                        // Thumbnail (pequena, para listagens)
                        SpatieMediaLibraryFileUpload::make('thumbnail')
                            ->label('Thumbnail')
                            ->collection('thumbnail')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                            ])
                            ->maxSize(512)
                            ->helperText('Imagem pequena para listagens (máx 512KB)'),
                        
                        // Featured Image (imagem destacada)
                        SpatieMediaLibraryFileUpload::make('featured')
                            ->label('Imagem Destacada')
                            ->collection('featured')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                            ])
                            ->maxSize(2048)
                            ->helperText('Imagem destacada (máx 2MB)'),
                        
                        // Cover Image (imagem de capa)
                        SpatieMediaLibraryFileUpload::make('cover')
                            ->label('Imagem de Capa')
                            ->collection('cover')
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatios([
                                '16:9',
                            ])
                            ->maxSize(2048)
                            ->helperText('Imagem de capa/header (máx 2MB)'),
                        
                        // Galeria de Imagens
                        SpatieMediaLibraryFileUpload::make('gallery')
                            ->label('Galeria de Imagens')
                            ->collection('gallery')
                            ->multiple()
                            ->image()
                            ->imageEditor()
                            ->maxFiles(20)
                            ->maxSize(2048)
                            ->helperText('Múltiplas imagens para galeria (máx 20 imagens)'),
                    ]),
                
                Forms\Components\Section::make('Descrições')
                    ->schema([
                        Forms\Components\RichEditor::make('description_pt')
                            ->label('Descrição em Português')
                            ->required()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'link',
                                'bulletList',
                                'orderedList',
                                'blockquote',
                            ])
                            ->columnSpanFull(),
                        
                        Forms\Components\RichEditor::make('description_es')
                            ->label('Descrição em Espanhol')
                            ->required()
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'link',
                                'bulletList',
                                'orderedList',
                                'blockquote',
                            ])
                            ->columnSpanFull(),
                    ]),
                
                Forms\Components\Section::make('Categorias')
                    ->schema([
                        Forms\Components\CheckboxList::make('categories')
                            ->label('Categorias')
                            ->relationship('categories', 'name')
                            ->searchable()
                            ->bulkToggleable()
                            ->columns(2),
                    ]),
                
                Forms\Components\Section::make('Localização')
                    ->schema([
                        Forms\Components\Textarea::make('google_maps_src')
                            ->label('Google Maps (iframe src)')
                            ->rows(3)
                            ->helperText('Cole apenas o src do iframe do Google Maps')
                            ->columnSpanFull(),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\SpatieMediaLibraryImageColumn::make('thumbnail')
                    ->collection('thumbnail')
                    ->label('Thumbnail')
                    ->circular()
                    ->size(50),
                
                Tables\Columns\TextColumn::make('name')
                    ->label('Nome')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('city.name')
                    ->label('Cidade')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('placeType.name')
                    ->label('Tipo')
                    ->searchable()
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('categories.name')
                    ->label('Categorias')
                    ->badge()
                    ->separator(','),
                
                Tables\Columns\TextColumn::make('order')
                    ->label('Ordem')
                    ->sortable(),
                
                Tables\Columns\IconColumn::make('active')
                    ->label('Ativo')
                    ->boolean(),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Criado em')
                    ->dateTime('d/m/Y H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('city_id')
                    ->label('Cidade')
                    ->relationship('city', 'name')
                    ->searchable()
                    ->preload(),
                
                Tables\Filters\SelectFilter::make('place_type_id')
                    ->label('Tipo')
                    ->relationship('placeType', 'name')
                    ->searchable()
                    ->preload(),
                
                Tables\Filters\Filter::make('categories')
                    ->form([
                        Forms\Components\Select::make('category_id')
                            ->label('Categoria')
                            ->relationship('categories', 'name')
                            ->searchable()
                            ->preload(),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['category_id'],
                                fn (Builder $query, $category): Builder => 
                                    $query->whereHas('categories', fn ($q) => $q->where('categories.id', $category))
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\BulkAction::make('activate')
                        ->label('Ativar')
                        ->icon('heroicon-o-check-circle')
                        ->action(fn ($records) => $records->each->update(['active' => true]))
                        ->requiresConfirmation(),
                    Tables\Actions\BulkAction::make('deactivate')
                        ->label('Desativar')
                        ->icon('heroicon-o-x-circle')
                        ->action(fn ($records) => $records->each->update(['active' => false]))
                        ->requiresConfirmation(),
                ]),
            ])
            ->defaultSort('order', 'asc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPlaces::route('/'),
            'create' => Pages\CreatePlace::route('/create'),
            'edit' => Pages\EditPlace::route('/{record}/edit'),
        ];
    }
}
```

---

### **Fase 5: Instalar e Configurar Spatie Media Library**

#### 5.1 Instalar o Pacote

```bash
composer require "spatie/laravel-medialibrary:^11.0"
php artisan vendor:publish --provider="Spatie\MediaLibrary\MediaLibraryServiceProvider" --tag="medialibrary-migrations"
php artisan migrate
```

#### 5.2 Instalar Plugin do Filament para Media Library

```bash
composer require filament/spatie-laravel-media-library-plugin:"^3.0"
```

#### 5.3 Configurar o Model Place

```php
<?php

namespace App\Models;

use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Place extends Model implements HasMedia, TranslatableContract
{
    use HasFactory, SoftDeletes, Translatable, InteractsWithMedia;

    // ... código existente ...

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('thumbnail')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
        
        $this->addMediaCollection('featured')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
        
        $this->addMediaCollection('cover')
            ->singleFile()
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
        
        $this->addMediaCollection('gallery')
            ->acceptsMimeTypes(['image/jpeg', 'image/png', 'image/webp']);
    }

    public function registerMediaConversions(Media $media = null): void
    {
        // Thumbnail: 300x300
        $this->addMediaConversion('thumb')
            ->width(300)
            ->height(300)
            ->sharpen(10)
            ->optimize()
            ->performOnCollections('thumbnail', 'featured', 'cover', 'gallery');
        
        // Featured: 1280x720
        $this->addMediaConversion('featured')
            ->width(1280)
            ->height(720)
            ->sharpen(10)
            ->optimize()
            ->performOnCollections('featured', 'cover');
        
        // Cover: 1920x1080
        $this->addMediaConversion('cover')
            ->width(1920)
            ->height(1080)
            ->sharpen(10)
            ->optimize()
            ->performOnCollections('cover');
    }

    // Helpers para acessar imagens
    public function getThumbnailUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('thumbnail', 'thumb') 
            ?: $this->getFirstMediaUrl('featured', 'thumb');
    }

    public function getFeaturedImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('featured', 'featured')
            ?: $this->getFirstMediaUrl('cover', 'featured');
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('cover', 'cover')
            ?: $this->getFirstMediaUrl('featured', 'cover');
    }

    public function getGalleryImagesAttribute(): array
    {
        return $this->getMedia('gallery')->map(function ($media) {
            return [
                'id' => $media->id,
                'url' => $media->getUrl(),
                'thumb' => $media->getUrl('thumb'),
            ];
        })->toArray();
    }
}
```

---

### **Fase 6: Configurar Middleware do Inertia para Ignorar Filament**

#### 6.1 Atualizar HandleInertiaRequests

```php
<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware\HandleInertiaRequests;

class HandleInertiaRequests extends Middleware
{
    // ... código existente ...

    public function handle(Request $request, \Closure $next)
    {
        // Ignorar requisições do Filament
        if (str_starts_with($request->path(), 'admin')) {
            return $next($request);
        }

        return parent::handle($request, $next);
    }
}
```

---

### **Fase 7: Estrutura Final de Rotas**

#### 7.1 routes/web.php (mantém como está)

```php
<?php

// ... imports existentes ...

// SITE PÚBLICO (Inertia.js)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/p/{PlaceIdentifier}', [\App\Http\Controllers\Site\PlaceController::class, 'getByPlaceIdentifier'])->name('places.byPlaceIdentifier');
// ... outras rotas públicas ...

// ADMIN ANTIGO (Inertia.js) - MANTER
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('places', PlaceController::class);
    Route::resource('events', EventController::class);
    // ... outras rotas admin antigas ...
});

// ADMIN NOVO (Filament) - será adicionado automaticamente em /admin/*
// Não precisa adicionar nada aqui!
```

---

### **Fase 8: Acessar os Painéis**

#### 8.1 URLs Finais

- **Admin Antigo (Inertia)**: `http://localhost/dashboard`
- **Admin Novo (Filament)**: `http://localhost/admin`
- **Site Público**: `http://localhost/`

#### 8.2 Login

Ambos usam a mesma autenticação! Você pode:
- Fazer login em `/login` e ir para `/dashboard` (admin antigo)
- Fazer login em `/admin/login` e ir para `/admin` (admin novo)
- Ou configurar redirecionamento customizado

---

## 🎨 Customização do Filament

### Tema e Branding

```php
// config/filament.php

'panels' => [
    'admin' => [
        'path' => 'admin',
        'brandName' => 'Destino Binacional',
        'brandLogo' => asset('images/logo.svg'),
        'darkMode' => true, // ou false
        'colors' => [
            'primary' => '#6366f1', // indigo
        ],
    ],
],
```

---

## 🔄 Migração Gradual

### Estratégia Recomendada

1. **Semana 1**: Instalar Filament, criar PlaceResource básico
2. **Semana 2**: Implementar sistema de imagens completo
3. **Semana 3**: Migrar Events, Tours, Categories
4. **Semana 4**: Adicionar widgets, relatórios, melhorias
5. **Depois**: Manter ambos ou desativar admin antigo gradualmente

---

## ✅ Vantagens desta Abordagem

1. ✅ **Zero Risco**: Admin antigo continua funcionando
2. ✅ **Teste Gradual**: Pode testar Filament sem pressa
3. ✅ **Migração Suave**: Migra entidade por entidade
4. ✅ **Mesma Autenticação**: Usuários existentes funcionam
5. ✅ **Mesmo Banco**: Dados compartilhados
6. ✅ **Flexibilidade**: Pode manter ambos ou escolher um

---

## 🚨 Pontos de Atenção

1. **Middleware Inertia**: Certifique-se de ignorar rotas `/admin`
2. **Assets**: Filament tem seus próprios assets, não conflita
3. **Sessões**: Ambos usam a mesma sessão do Laravel
4. **Cache**: Limpar cache após instalação: `php artisan optimize:clear`

---

## 📚 Próximos Passos

1. Instalar Filament
2. Criar PlaceResource com Media Library
3. Testar upload de imagens
4. Migrar outras entidades
5. Adicionar widgets e relatórios

---

**Pronto para começar?** 🚀
