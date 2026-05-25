<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\External\OpenWeatherMapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WeatherController extends Controller
{
    public function __construct(private readonly OpenWeatherMapService $weather) {}

    public function current(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lon' => ['required', 'numeric', 'between:-180,180'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Clima atual encontrado com sucesso.',
            'data' => $this->weather->current((float) $validated['lat'], (float) $validated['lon']),
        ]);
    }
}
