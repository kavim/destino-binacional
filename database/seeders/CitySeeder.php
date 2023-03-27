<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use App\Models\State;
use Illuminate\Database\Seeder;

class CitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $country_json = '[{
                            "name" : "Brasil",
                            "code" : "BR"
                        }, {
                            "name" : "Uruguay",
                            "code" : "UY"
                        }]';

        foreach (json_decode($country_json, true) as $country) {
            Country::create([
                'name' => $country['name'],
                'code' => $country['code'],
            ]);
        }

        $state_json = [
            [
                'name' => 'Rio Grande do Sul',
                'code' => 'RS',
            ],
            [
                'name' => 'Rivera',
                'code' => 'Rivera',
            ],
        ];

        foreach ($state_json as $state) {
            State::create([
                'name' => $state['name'],
                'code' => $state['name'],
            ]);
        }

        $city_json = '[{
                        "name" : "Sant Ana do Livramento",
                        "state_id" : 1,
                        "latitude"  : -30.8773,
                        "longitude" : -55.5392
                     }, {
                        "name" : "Rivera",
                        "state_id" : 2,
                        "latitude"  : -30.8773,
                        "longitude" : -55.5393
                     }, {
                        "name" : "Vichadero",
                        "state_id" : 2,
                        "latitude"  : -30.8773,
                        "longitude" : -55.5393
                     }, {
                        "name" : "Minas de Corrales",
                        "state_id" : 2,
                        "latitude"  : -30.8773,
                        "longitude" : -55.5393
                     }, {
                        "name" : "Valle de Lunarejo",
                        "state_id" : 2,
                        "latitude"  : -30.8773,
                        "longitude" : -55.5393
                     }]';

        foreach (json_decode($city_json, true) as $cj) {
            City::create($cj);
        }
    }
}
