<?php

namespace App\Repositories;

use App\Models\Trip;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class TripRepository
{
    public function paginateForUser(int $userId, array $filters): LengthAwarePaginator
    {
        $query = Trip::query()->where('user_id', $userId);

        $this->applyFilters($query, $filters);

        $sort = in_array($filters['sort'] ?? '', ['created_at', 'start_date', 'budget', 'destination_city'], true)
            ? $filters['sort']
            : 'created_at';

        $direction = ($filters['direction'] ?? 'desc') === 'asc' ? 'asc' : 'desc';
        $perPage = min((int) ($filters['per_page'] ?? 10), 50);

        return $query->orderBy($sort, $direction)->paginate($perPage);
    }

    public function create(array $data): Trip
    {
        return Trip::create($data);
    }

    public function update(Trip $trip, array $data): Trip
    {
        $trip->update($data);

        return $trip->refresh();
    }

    public function delete(Trip $trip): void
    {
        $trip->delete();
    }

    private function applyFilters(Builder $query, array $filters): void
    {
        $query
            ->when($filters['q'] ?? null, function (Builder $query, string $search): void {
                $query->where(function (Builder $query) use ($search): void {
                    $query
                        ->where('destination_city', 'like', "%{$search}%")
                        ->orWhere('destination_country', 'like', "%{$search}%");
                });
            })
            ->when($filters['country'] ?? null, fn (Builder $query, string $country) => $query->where('destination_country', $country))
            ->when($filters['from'] ?? null, fn (Builder $query, string $date) => $query->whereDate('start_date', '>=', $date))
            ->when($filters['to'] ?? null, fn (Builder $query, string $date) => $query->whereDate('end_date', '<=', $date));
    }
}
