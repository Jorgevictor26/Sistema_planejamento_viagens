<?php

namespace App\Services\External;

use Illuminate\Http\Client\PendingRequest;
use Illuminate\Support\Facades\Http;

class GeoDbCitiesService
{
    public function search(string $query): array
    {
        return collect()
            ->merge($this->searchCountries($query))
            ->merge($this->searchCities($query))
            ->values()
            ->all();
    }

    private function searchCities(string $query): array
    {
        $response = $this->client()
            ->get('/v1/geo/cities', [
                'namePrefix' => $query,
                'limit' => 10,
                'sort' => '-population',
            ])
            ->throw()
            ->json('data', []);

        return collect($response)
            ->map(fn (array $city): array => [
                'type' => 'city',
                'id' => $city['id'] ?? null,
                'name' => $city['name'] ?? null,
                'city' => $city['city'] ?? ($city['name'] ?? null),
                'country' => $city['country'] ?? null,
                'country_code' => $city['countryCode'] ?? null,
                'region' => $city['region'] ?? null,
                'latitude' => $city['latitude'] ?? null,
                'longitude' => $city['longitude'] ?? null,
                'population' => $city['population'] ?? null,
            ])
            ->values()
            ->all();
    }

    private function searchCountries(string $query): array
    {
        $response = $this->client()
            ->get('/v1/geo/countries', [
                'namePrefix' => $query,
                'limit' => 10,
            ])
            ->throw()
            ->json('data', []);

        return collect($response)
            ->map(fn (array $country): array => [
                'type' => 'country',
                'id' => $country['code'] ?? null,
                'name' => $country['name'] ?? null,
                'city' => null,
                'country' => $country['name'] ?? null,
                'country_code' => $country['code'] ?? null,
                'region' => null,
                'latitude' => null,
                'longitude' => null,
                'population' => null,
            ])
            ->values()
            ->all();
    }

    private function client(): PendingRequest
    {
        $client = Http::baseUrl(config('services.geodb.base_url'))
            ->acceptJson()
            ->timeout(10);

        if (config('services.geodb.api_key')) {
            $client = $client->withHeader(config('services.geodb.api_key_header'), config('services.geodb.api_key'));
        }

        return $client;
    }
}
