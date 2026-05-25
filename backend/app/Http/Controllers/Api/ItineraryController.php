<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Itinerary;
use App\Services\ItineraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ItineraryController extends Controller
{
    public function __construct(private readonly ItineraryService $itineraries) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success('Itinerarios encontrados com sucesso.', $this->itineraries->list(Auth::id(), $request->query()));
    }

    public function store(Request $request): JsonResponse
    {
        return $this->success(
            'Itinerario criado com sucesso.',
            $this->itineraries->create(Auth::id(), $this->validated($request)),
            Response::HTTP_CREATED
        );
    }

    public function update(Request $request, Itinerary $itinerary): JsonResponse
    {
        return $this->success(
            'Itinerario atualizado com sucesso.',
            $this->itineraries->update(Auth::id(), $itinerary, $this->validated($request, true))
        );
    }

    public function destroy(Itinerary $itinerary): JsonResponse
    {
        $this->itineraries->delete(Auth::id(), $itinerary);

        return $this->success('Itinerario removido com sucesso.');
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'trip_id' => [$required, 'integer', 'exists:trips,id'],
            'day' => [$required, 'integer', 'min:1'],
            'activity' => [$required, 'string', 'max:255'],
            'location' => ['nullable', 'string', 'max:255'],
            'time' => ['nullable', 'date_format:H:i'],
            'description' => ['nullable', 'string'],
        ]);
    }

    private function success(string $message, mixed $data = null, int $status = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }
}
