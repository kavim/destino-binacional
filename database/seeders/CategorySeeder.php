<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryTranslation;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $name_es = ['Alojamiento', 'Gastronomía ', 'Atractivos turísticos', 'Servicios'];

        $name_en = ['Accommodation', 'Gastronomy', 'Tourist Attractions', 'Services'];

        $name_pt = ['Hospedagem', 'Gastronomia', 'Atrativos turísticos', 'Serviços'];

        $icons = [
            'icons/lojamiento.svg',
            'icons/gastronomia.svg',
            'icons/turisticos.svg',
            'icons/servicios.svg',
        ];

        $description_es = [
            'Rivera y Santana do Livramento cuenta con una variada oferta de alojamientos capaces de brindar servicios de primera calidad y capacidad para realizar eventos empresariales, congresos y seminarios.',
            'Entre todos los encantos de ocio y turismo que encuentras en Rivera y Santana do Livramento, puedes disfrutar de nuestra variada gastronomía. Desde la típica cocina campestre y parrilladas, hasta el servicio de la mejor gastronomía internacional.',
            'Nuestros atractivos le han dado reconocimiento como uno de los mejores lugares para el turismo rural, aventura, ecoturismo, observación de aves, compras y eventos. ',
            'Para facilitar tu viaje te brindamos toda la información necesaria para disfrutar tu estadía.',
        ];

        $description_en = [
            'Rivera and Santana do Livramento has a wide range of accommodations capable of providing top quality services and the capacity to hold business events, congresses and seminars.',
            'Among all the leisure and tourism charms that you find in Rivera and Santana do Livramento, you can enjoy our varied gastronomy. From the typical country cuisine and barbecues, to the service of the best international cuisine.',
            'Our attractions have given it recognition as one of the best places for rural tourism, adventure, ecotourism, bird watching, shopping and events.',
            'Discover the best services on the frontier',
        ];

        $description_pt = [
            'Rivera y Santana do Livramento cuenta con una variada oferta de alojamientos capaces de brindar servicios de primera calidad y capacidad para realizar eventos empresariales, congresos y seminarios.',
            'Entre todos os encantos do lazer e turismo que você encontra em Rivera e Santana do Livramento, você pode desfrutar da nossa variada gastronomia. Desde a típica cozinha sertaneja e churrascos, ao serviço da melhor cozinha internacional.',
            'Nossas atrações lhe conferem o reconhecimento como um dos melhores locais para turismo rural, aventura, ecoturismo, observação de pássaros, compras e eventos.',
            'Para facilitar a sua viagem disponibilizamos todas as informações necessárias para que desfrute da sua estadia.',
        ];

        $featured_images = [
            'https://i.imgur.com/0zg6CyYl.jpg',
            'https://i.imgur.com/g5fL66rl.jpg',
            'https://i.imgur.com/TdBpx81l.jpg',
            'https://i.imgur.com/0McfApO.jpg',
        ];

        $colors = ['#273572', '#561D56', '#006F37', '#B71923', '#8E391D'];

        for ($i = 0; $i < count($name_es); $i++) {
            $placeCategory = Category::create([
                'color' => $colors[$i],
                'icon' => $icons[$i],
                'featured_image' => $featured_images[$i],
            ]);

            CategoryTranslation::create([
                'locale' => 'es',
                'name' => $name_es[$i],
                'slug' => Str::slug($name_es[$i], '-'),
                'description' => $description_es[$i],
                'category_id' => $placeCategory->id,
            ]);

            CategoryTranslation::create([
                'locale' => 'pt',
                'name' => $name_pt[$i],
                'slug' => Str::slug($name_pt[$i], '-'),
                'description' => $description_pt[$i],
                'category_id' => $placeCategory->id,
            ]);

            CategoryTranslation::create([
                'locale' => 'en',
                'name' => $name_en[$i],
                'slug' => Str::slug($name_en[$i], '-'),
                'description' => $description_en[$i],
                'category_id' => $placeCategory->id,
            ]);
        }

        $place_subcategories = [[
            [1, 'Hotel', 'Hotel', 'Hotel'],
            [1, 'Pousada', 'Posada', 'Roost'],
            [1, 'Hostel', 'Hostel', 'Hostel'],
            [1, 'Estabelecimentos Rurais', 'Establecimientos Rurales', 'Rural Establishment'],
            [1, 'Motel', 'Motel', 'Motel'],
            [1, 'Camping', 'Camping', 'Camping'],
        ], [
            [2, 'Parrillada', 'Parrillada', 'Parrillada'],
            [2, 'Pizzaria', 'Pizzería', 'Pizzeria'],
            [2, 'Restaurante', 'Restaurante', 'Restaurant'],
            [2, 'Fast Food', 'Fast Food', 'Fast Food'],
            [2, 'Sorveteria', 'Heladerías', 'Ice Cream Shop'],
            [2, 'Bar e Pub', 'Bar y Pub', 'Bar and Pub'],
            [2, 'Cafeteria', 'Cafetería', 'Coffee Shop'],
        ], [
            [3, 'Turismo Rural', 'Turismo Rural', 'Rural Tourism'],
            [3, 'Turismo Cultural', 'Turismo Cultural', 'Cultural Tourism'],
            [3, 'Enoturismo', 'Enoturismo', 'Wine Tourism'],
            [3, 'Turismo Termal', 'Turismo Termal', 'Thermal Tourism'],
            [3, 'Lugares para Visitar', 'Lugares para Visitar', 'Places to Visit'],
            [3, 'Turismo Mineiro', 'Turismo Minero', 'Mining Tourism'],
        ], [
            [4, 'Centro de Informação Turística', 'Centro de Información Turística', 'Tourist Information Center'],
            [4, 'Comércio Free Shop', 'Comercio Free Shop', 'Free Shop'],
            [4, 'Shopping Center', 'Shopping Center', 'Shopping Center'],
            [4, 'Agência de Viagem', 'Agencias de viajes', 'Travel Agency'],
            [4, 'Guias de Turismo', 'Guías de turismo', 'Tourist Guide'],
            [4, 'Aluguel de veículos', 'Alquiler de autos', 'Car Rental'],
            [4, 'Aplicativos de uso público', 'Aplicativos de uso público', 'Applications for public use'],
            [4, 'Arte e cultura', 'Arte y Cultura', 'Art and Culture'],
            [4, 'Meio Ambiente', 'Medio Ambiente', 'Environment'],
            [4, 'Esportes', 'Deporte', 'Sport'],
            [4, 'Bliblioteca', 'Biblioteca', 'Library'],
            [4, 'Aeroporto', 'Aeropuerto', 'Airport'],
            [4, 'Empresa de Transporte', 'Empresas de Transporte', 'Transport Companies'],
            [4, 'Taxi e Transporte Urbano', 'Taxi y Transporte Urbano', 'Taxi and Urban Transport'],
            [4, 'Intendencia Departamental de Rivera', 'Intendencia Departamental de Rivera', 'Intendencia Departamental de Rivera'],
            [4, 'Consulado', 'Consulado', 'Consulate'],
            [4, 'Correio', 'Correo', 'Mail'],
            [4, 'Hospital', 'Hospital', 'Hospital'],
            [4, 'Bombeiro', 'Bombero', 'Fireman'],
            [4, 'Polícia', 'Policía', 'Police'],
            [4, 'Universidade', 'Universidade', 'University'],
            [4, 'Zona Franca', 'Zona Franca', 'Free Zone'],
            [4, 'Prefeitura Municipal', 'Prefeitura Municipal', 'Prefeitura Municipal']]];

        $i = 0;

        $locales = ['pt', 'es', 'en'];

        for ($i = 0; $i < count($place_subcategories); $i++) {
            foreach ($place_subcategories[$i] as $p) {
                $psc = Category::create([
                    'parent_id' => $p[0],
                ]);

                for ($j = 0; $j < count($locales); $j++) {
                    CategoryTranslation::create([
                        'locale' => $locales[$j],
                        'name' => $p[$j + 1],
                        'slug' => Str::slug($p[$j + 1], '-'),
                        'category_id' => $psc->id,
                    ]);
                }
            }
        }
    }
}
