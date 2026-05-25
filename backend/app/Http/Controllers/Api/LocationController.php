<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\External\GeoDbCitiesService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function __construct(private readonly GeoDbCitiesService $cities) {}

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:120'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Destinos encontrados com sucesso.',
            'data' => $this->cities->search($validated['q']),
        ]);
    }
}
