<?php

namespace App\Services;

use App\Models\Itinerary;
use App\Models\Trip;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class ItineraryService
{
    public function list(int $userId, array $filters): LengthAwarePaginator
    {
        $query = Itinerary::query()
            ->whereHas('trip', fn ($query) => $query->where('user_id', $userId))
            ->with('trip:id,user_id,destination_city,destination_country');

        $query
            ->when($filters['trip_id'] ?? null, fn ($query, string $tripId) => $query->where('trip_id', $tripId))
            ->when($filters['day'] ?? null, fn ($query, string $day) => $query->where('day', $day))
            ->when($filters['q'] ?? null, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query
                        ->where('activity', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%");
                });
            });

        $perPage = min(max((int) ($filters['per_page'] ?? 20), 1), 50);

        return $query->orderBy('day')->orderBy('time')->paginate($perPage);
    }

    public function create(int $userId, array $data): Itinerary
    {
        $this->ensureTripBelongsToUser($userId, (int) $data['trip_id']);

        return Itinerary::create($data)->load('trip:id,user_id,destination_city,destination_country');
    }

    public function update(int $userId, Itinerary $itinerary, array $data): Itinerary
    {
        $this->authorizeItinerary($userId, $itinerary);

        if (array_key_exists('trip_id', $data)) {
            $this->ensureTripBelongsToUser($userId, (int) $data['trip_id']);
        }

        $itinerary->update($data);

        return $itinerary->refresh()->load('trip:id,user_id,destination_city,destination_country');
    }

    public function delete(int $userId, Itinerary $itinerary): void
    {
        $this->authorizeItinerary($userId, $itinerary);
        $itinerary->delete();
    }

    private function authorizeItinerary(int $userId, Itinerary $itinerary): void
    {
        $itinerary->loadMissing('trip');

        abort_if($itinerary->trip->user_id !== $userId, Response::HTTP_FORBIDDEN);
    }

    private function ensureTripBelongsToUser(int $userId, int $tripId): void
    {
        abort_unless(
            Trip::query()->where('id', $tripId)->where('user_id', $userId)->exists(),
            Response::HTTP_UNPROCESSABLE_ENTITY,
            'A viagem informada nao pertence ao usuario autenticado.'
        );
    }
}
