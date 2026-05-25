<?php

namespace App\Services;

use App\Models\Trip;
use App\Repositories\TripRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class TripService
{
    public function __construct(private readonly TripRepository $trips) {}

    public function list(int $userId, array $filters): LengthAwarePaginator
    {
        return $this->trips->paginateForUser($userId, $filters);
    }

    public function create(int $userId, array $data): Trip
    {
        $data['user_id'] = $userId;
        $data['image'] = $this->storeImage($data['image'] ?? null);

        return $this->trips->create($data);
    }

    public function update(Trip $trip, array $data): Trip
    {
        if (array_key_exists('image', $data)) {
            $this->deleteImage($trip->image);
            $data['image'] = $this->storeImage($data['image']);
        }

        return $this->trips->update($trip, $data);
    }

    public function delete(Trip $trip): void
    {
        $this->deleteImage($trip->image);
        $this->trips->delete($trip);
    }

    private function storeImage(mixed $image): ?string
    {
        if (! $image instanceof UploadedFile) {
            return null;
        }

        return $image->store('trips', 'public');
    }

    private function deleteImage(?string $path): void
    {
        if ($path) {
            Storage::disk('public')->delete($path);
        }
    }
}
