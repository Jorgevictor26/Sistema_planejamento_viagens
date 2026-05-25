<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TripResource;
use App\Models\Trip;
use App\Services\TripService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TripController extends Controller
{
    public function __construct(private readonly TripService $trips) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success('Viagens encontradas com sucesso.', TripResource::collection($this->trips->list(Auth::id(), $request->query()))->response()->getData(true));
    }

    public function store(Request $request): JsonResponse
    {
        $trip = $this->trips->create(Auth::id(), $this->validated($request));

        return $this->success('Viagem criada com sucesso.', new TripResource($trip), Response::HTTP_CREATED);
    }

    public function show(Trip $trip): JsonResponse
    {
        $this->authorizeTrip($trip);

        return $this->success('Viagem encontrada com sucesso.', new TripResource($trip));
    }

    public function update(Request $request, Trip $trip): JsonResponse
    {
        $this->authorizeTrip($trip);

        return $this->success('Viagem atualizada com sucesso.', new TripResource($this->trips->update($trip, $this->validated($request, true))));
    }

    public function destroy(Trip $trip): JsonResponse
    {
        $this->authorizeTrip($trip);
        $this->trips->delete($trip);

        return $this->success('Viagem removida com sucesso.');
    }

    private function authorizeTrip(Trip $trip): void
    {
        abort_if($trip->user_id !== Auth::id(), Response::HTTP_FORBIDDEN);
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'destination_city' => [$required, 'string', 'max:255'],
            'destination_country' => [$required, 'string', 'max:255'],
            'latitude' => [$required, 'numeric', 'between:-90,90'],
            'longitude' => [$required, 'numeric', 'between:-180,180'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'budget' => ['nullable', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'image', 'max:4096'],
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
