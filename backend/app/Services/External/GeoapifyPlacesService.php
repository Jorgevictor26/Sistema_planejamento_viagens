<?php

namespace App\Services\External;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class GeoapifyPlacesService
{
    private const CATEGORIES = [
        'hotels' => 'accommodation.hotel,accommodation.apartment,accommodation.guest_house',
        'restaurants' => 'catering.restaurant,catering.cafe,catering.fast_food',
        'services' => 'healthcare.pharmacy,healthcare.hospital,public_transport,service',
    ];

    public function places(float $lat, float $lon, string $type): array
    {
        $apiKey = trim((string) config('services.geoapify.key'));

        if (! $apiKey) {
            Log::warning('Geoapify API key is missing.');
            return [];
        }

        try {
            $response = Http::baseUrl(config('services.geoapify.base_url'))
                ->acceptJson()
                ->timeout(10)
                ->get('/v2/places', [
                    'categories' => self::CATEGORIES[$type] ?? self::CATEGORIES['services'],
                    'filter' => "circle:{$lon},{$lat},7000",
                    'bias' => "proximity:{$lon},{$lat}",
                    'limit' => 12,
                    'apiKey' => $apiKey,
                ]);

            if (! $response->successful()) {
                Log::warning('Geoapify Places API unavailable.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            }

            $features = $response->json('features', []);
        } catch (Throwable $exception) {
            Log::warning('Geoapify Places API request failed.', [
                'message' => $exception->getMessage(),
            ]);

            return [];
        }

        return collect($features)
            ->map(function (array $feature): array {
                $properties = $feature['properties'] ?? [];

                return [
                    'id' => $properties['place_id'] ?? null,
                    'name' => $properties['name'] ?? ($properties['address_line1'] ?? null),
                    'category' => $this->categoryLabel($properties['categories'][0] ?? null),
                    'rating' => null,
                    'distance' => $properties['distance'] ?? null,
                    'address' => $properties['formatted'] ?? ($properties['address_line2'] ?? null),
                    'image' => null,
                ];
            })
            ->filter(fn (array $place): bool => filled($place['name']))
            ->values()
            ->all();
    }

    private function categoryLabel(?string $category): string
    {
        return match (true) {
            str_contains((string) $category, 'accommodation') => 'Hotel',
            str_contains((string) $category, 'catering') => 'Restaurante',
            str_contains((string) $category, 'pharmacy') => 'Farmacia',
            str_contains((string) $category, 'hospital') => 'Hospital',
            str_contains((string) $category, 'public_transport') => 'Transporte',
            default => 'Servico',
        };
    }
}
