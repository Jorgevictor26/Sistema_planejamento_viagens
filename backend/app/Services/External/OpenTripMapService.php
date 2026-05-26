<?php

namespace App\Services\External;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

class OpenTripMapService
{
    public function attractions(float $lat, float $lon): array
    {
        $apiKey = trim((string) config('services.opentripmap.key'));

        if (! $apiKey) {
            Log::warning('OpenTripMap API key is missing.');
            return [];
        }

        try {
            $response = Http::baseUrl(config('services.opentripmap.base_url'))
                ->acceptJson()
                ->timeout(10)
                ->get('/0.1/en/places/radius', [
                    'radius' => 7000,
                    'lon' => $lon,
                    'lat' => $lat,
                    'kinds' => 'interesting_places,museums,monuments,beaches,historic,architecture,natural',
                    'rate' => 2,
                    'limit' => 12,
                    'format' => 'json',
                    'apikey' => $apiKey,
                ]);

            if (! $response->successful()) {
                Log::warning('OpenTripMap API unavailable.', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [];
            }

            $places = $response->json();
        } catch (Throwable $exception) {
            Log::warning('OpenTripMap API request failed.', [
                'message' => $exception->getMessage(),
            ]);

            return [];
        }

        return collect($places)
            ->map(fn (array $place): array => [
                'id' => $place['xid'] ?? null,
                'name' => $place['name'] ?? null,
                'category' => $this->categoryLabel($place['kinds'] ?? ''),
                'rating' => null,
                'distance' => $place['dist'] ?? null,
                'address' => null,
                'image' => null,
            ])
            ->filter(fn (array $place): bool => filled($place['name']))
            ->values()
            ->all();
    }

    private function categoryLabel(string $kinds): string
    {
        return match (true) {
            str_contains($kinds, 'museums') => 'Museu',
            str_contains($kinds, 'monuments') => 'Monumento',
            str_contains($kinds, 'beaches') => 'Praia',
            str_contains($kinds, 'natural') => 'Natureza',
            default => 'Atracao',
        };
    }
}
