<?php

namespace Database\Seeders;

use App\Models\Tag;
use Illuminate\Database\Seeder;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tipo = Tag::Create([
            'parent_id' => null,
        ]);

        $tipo->translations()->create([
            'name' => 'Tipo',
            'locale' => 'es',
        ]);

        $tipo->translations()->create([
            'name' => 'Tipo',
            'locale' => 'pt',
        ]);

        $name_es = [
            'Académico - Seminario / Jornada', 'Gastronomía ',
            'Científico - Congreso / Simposio',
            'Corporativo - Empresarial',
            'Curso - Workshop / Taller',
            'Entretenimiento - Show / Fiesta',
            'Artístico Cultural - Festival / Exposición',
            'Religioso',
            'Deportivo - Partidos / Torneos / Esporte',
            'Exhibiciones - Feria / Exposición / Exposições',
            'Networking - Encuentro / Meetup',
        ];

        $name_pt = [
            'Acadêmico - Seminário / Jornada',
            'Gastronomia',
            'Científico - Congresso / Simpósio',
            'Corporativo - Empresarial',
            'Curso - Workshop / Oficina',
            'Entretenimento - Show / Festa',
            'Artístico Cultural - Festival / Exposição',
            'Religioso',
            'Esportivo - Jogos / Torneios / Esporte',
            'Exibições - Feira / Exposição / Exposições',
            'Networking - Encontro / Meetup',
        ];

        for ($i = 0; $i < count($name_es); $i++) {
            $ntag = Tag::Create([
                'parent_id' => $tipo->id,
            ]);

            $ntag->translations()->create([
                'name' => $name_es[$i],
                'locale' => 'es',
            ]);

            $ntag->translations()->create([
                'name' => $name_pt[$i],
                'locale' => 'pt',
            ]);
        }

        $asunto = Tag::Create([
            'parent_id' => null,
        ]);

        $asunto->translations()->create([
            'name' => 'Asunto',
            'locale' => 'es',
        ]);

        $asunto->translations()->create([
            'name' => 'Assunto',
            'locale' => 'pt',
        ]);

        $name_es = [
            'Agricultura, Pesca y Veterinária',
            'Artes y Humanidades',
            'Ciencias Sociales y Periodismo',
            'Computación y Tecnologías de la Información',
            'Derecho',
            'Educación',
            'Emprendedorismo e Inovación',
            'Ingeniería',
            'Gastronomía',
            'Enología',
            'Medicina',
            'Negocios y Administración',
            'Salud y Bien Estar',
            'Desarrollo Personal',
            'Religioso y Espiritualidad',
            'Criollas',
            'Deportes',
            'Moda y Belleza',
            'Marketing Ventas',
            'Música',
            'Danza',
        ];

        $name_pt = [
            'Agricultura, Pesca e Veterinária',
            'Artes e Humanidades',
            'Ciências Sociais e Jornalismo',
            'Computação e Tecnologias da Informação',
            'Direito',
            'Educação',
            'Empreendedorismo e Inovação',
            'Engenharia',
            'Gastronomia',
            'Enologia',
            'Medicina',
            'Negócios e Administração',
            'Saúde e Bem Estar',
            'Desenvolvimento Pessoal',
            'Religioso e Espiritualidade',
            'Criollas',
            'Esportes',
            'Moda e Beleza',
            'Marketing Vendas',
            'Música',
            'Dança',
        ];

        for ($i = 0; $i < count($name_es); $i++) {
            $atag = Tag::Create([
                'parent_id' => $asunto->id,
            ]);

            $atag->translations()->create([
                'name' => $name_es[$i],
                'locale' => 'es',
            ]);

            $atag->translations()->create([
                'name' => $name_pt[$i],
                'locale' => 'pt',
            ]);
        }
    }
}
