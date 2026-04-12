<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\City;
use App\Models\Event;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Eventos futuros espalhados em vários dias — útil para testar o slider/chips da home.
 *
 * php artisan db:seed --class=DemoSliderEventsSeeder
 */
class DemoSliderEventsSeeder extends Seeder
{
    public function run(): void
    {
        $cityId = City::query()->value('id');
        $categoryId = Category::query()->value('id');

        $titles = [
            'Festival na Fronteira',
            'Feira de artesanato',
            'Show regional',
            'Corrida binacional',
            'Workshop de fotografia',
            'Cultura e música ao vivo',
            'Encontro de gastronomia',
            'Teatro ao ar livre',
            'Feira do livro',
            'Caminhada ecológica',
            'Mostra de cinema',
            'Jam session',
            'Mercado noturno',
            'Aulas abertas de dança',
            'Stand up na praça',
            'Exposição histórica',
            'Maratona de curtas',
            'Show acústico',
        ];

        foreach ($titles as $idx => $baseTitle) {
            $dayOffset = intdiv($idx, 3);
            $start = Carbon::now()->startOfDay()->addDays(1 + $dayOffset);
            $token = Str::lower(Str::random(7));
            $slug = Str::slug($baseTitle).'-demo-'.$token;

            Event::query()->create([
                'title' => $baseTitle.' (demo)',
                'slug' => $slug,
                'description' => 'Evento de demonstração para testar o carrossel na página inicial.',
                'start' => $start,
                'end' => $start->copy(),
                'is_online' => false,
                'link' => null,
                'google_maps_src' => null,
                'address' => 'Centro — demo',
                'city_id' => $cityId,
                'category_id' => $categoryId,
                'price' => null,
                'door_time' => null,
                'featured_image' => null,
            ]);
        }

        $this->command?->info('Criados '.count($titles).' eventos demo (futuros, em 6 dias distintos).');
    }
}
