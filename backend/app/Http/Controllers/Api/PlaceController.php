<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\External\GeoapifyPlacesService;
use App\Services\External\OpenTripMapService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PlaceController extends Controller
{
    public function __construct(
        private readonly GeoapifyPlacesService $geoapify,
        private readonly OpenTripMapService $openTripMap,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lon' => ['required', 'numeric', 'between:-180,180'],
            'type' => ['required', 'string', 'in:hotels,restaurants,services,attractions'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Locais encontrados com sucesso.',
            'data' => $this->placesByType((float) $validated['lat'], (float) $validated['lon'], $validated['type']),
        ]);
    }

    public function nearby(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'lat' => ['required', 'numeric', 'between:-90,90'],
            'lon' => ['required', 'numeric', 'between:-180,180'],
            'lang' => ['nullable', 'string', 'in:pt,en'],
        ]);

        $lat = (float) $validated['lat'];
        $lon = (float) $validated['lon'];

        return response()->json([
            'success' => true,
            'message' => 'Locais próximos encontrados com sucesso.',
            'data' => collect()
                ->merge($this->placesByType($lat, $lon, 'hotels'))
                ->merge($this->placesByType($lat, $lon, 'restaurants'))
                ->merge($this->placesByType($lat, $lon, 'services'))
                ->merge($this->placesByType($lat, $lon, 'attractions'))
                ->take(24)
                ->values()
                ->all(),
        ]);
    }

    private function placesByType(float $lat, float $lon, string $type): array
    {
        return $type === 'attractions'
            ? $this->openTripMap->attractions($lat, $lon)
            : $this->geoapify->places($lat, $lon, $type);
    }
}
