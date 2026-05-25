<?php

namespace App\Services\External;

use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\ServiceUnavailableHttpException;

class OpenWeatherMapService
{
    public function current(float $lat, float $lon): array
    {
        $apiKey = config('services.openweather.key');

        if (! $apiKey) {
            throw new ServiceUnavailableHttpException(null, 'OpenWeatherMap API key nao configurada.');
        }

        $weather = Http::baseUrl(config('services.openweather.base_url'))
            ->acceptJson()
            ->timeout(10)
            ->get('/data/2.5/weather', [
                'lat' => $lat,
                'lon' => $lon,
                'appid' => $apiKey,
                'units' => config('services.openweather.units'),
                'lang' => config('services.openweather.lang'),
            ])
            ->throw()
            ->json();

        return [
            'city' => $weather['name'] ?? null,
            'country' => $weather['sys']['country'] ?? null,
            'coordinates' => [
                'lat' => $weather['coord']['lat'] ?? $lat,
                'lon' => $weather['coord']['lon'] ?? $lon,
            ],
            'temperature' => $weather['main']['temp'] ?? null,
            'feels_like' => $weather['main']['feels_like'] ?? null,
            'humidity' => $weather['main']['humidity'] ?? null,
            'wind_speed' => $weather['wind']['speed'] ?? null,
            'description' => $weather['weather'][0]['description'] ?? null,
            'icon' => $weather['weather'][0]['icon'] ?? null,
        ];
    }
}
