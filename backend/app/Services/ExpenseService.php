<?php

namespace App\Services;

use App\Models\Expense;
use App\Models\Trip;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class ExpenseService
{
    public function list(int $userId, array $filters): LengthAwarePaginator
    {
        $query = Expense::query()
            ->whereHas('trip', fn ($query) => $query->where('user_id', $userId))
            ->with('trip:id,user_id,destination_city,destination_country');

        $query
            ->when($filters['trip_id'] ?? null, fn ($query, string $tripId) => $query->where('trip_id', $tripId))
            ->when($filters['category'] ?? null, fn ($query, string $category) => $query->where('category', $category))
            ->when($filters['from'] ?? null, fn ($query, string $date) => $query->whereDate('expense_date', '>=', $date))
            ->when($filters['to'] ?? null, fn ($query, string $date) => $query->whereDate('expense_date', '<=', $date));

        $perPage = min(max((int) ($filters['per_page'] ?? 10), 1), 50);

        return $query->latest('expense_date')->latest()->paginate($perPage);
    }

    public function create(int $userId, array $data): Expense
    {
        $this->ensureTripBelongsToUser($userId, (int) $data['trip_id']);

        return Expense::create($data)->load('trip:id,user_id,destination_city,destination_country');
    }

    public function update(int $userId, Expense $expense, array $data): Expense
    {
        $this->authorizeExpense($userId, $expense);

        if (array_key_exists('trip_id', $data)) {
            $this->ensureTripBelongsToUser($userId, (int) $data['trip_id']);
        }

        $expense->update($data);

        return $expense->refresh()->load('trip:id,user_id,destination_city,destination_country');
    }

    public function delete(int $userId, Expense $expense): void
    {
        $this->authorizeExpense($userId, $expense);
        $expense->delete();
    }

    private function authorizeExpense(int $userId, Expense $expense): void
    {
        $expense->loadMissing('trip');

        abort_if($expense->trip->user_id !== $userId, Response::HTTP_FORBIDDEN);
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
