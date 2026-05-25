<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use App\Models\Trip;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        $userId = Auth::id();

        return $this->success('Estatisticas encontradas com sucesso.', [
            'total_trips' => Trip::query()->where('user_id', $userId)->count(),
            'total_spent' => $this->expenseQuery($userId)->sum('amount'),
            'popular_destinations' => $this->popularDestinations($userId),
        ]);
    }

    public function recentTrips(): JsonResponse
    {
        return $this->success(
            'Viagens recentes encontradas com sucesso.',
            Trip::query()
                ->where('user_id', Auth::id())
                ->latest('created_at')
                ->limit(5)
                ->get()
        );
    }

    public function expensesSummary(): JsonResponse
    {
        $userId = Auth::id();

        return $this->success('Resumo de despesas encontrado com sucesso.', [
            'total_spent' => $this->expenseQuery($userId)->sum('amount'),
            'monthly_expenses' => $this->monthlyExpenses($userId),
            'popular_destinations' => $this->popularDestinations($userId),
        ]);
    }

    private function expenseQuery(int $userId)
    {
        return Expense::query()
            ->whereHas('trip', fn ($query) => $query->where('user_id', $userId));
    }

    private function popularDestinations(int $userId): array
    {
        return Trip::query()
            ->select('destination_city', 'destination_country', DB::raw('count(*) as total'))
            ->where('user_id', $userId)
            ->groupBy('destination_city', 'destination_country')
            ->orderByDesc('total')
            ->limit(5)
            ->get()
            ->toArray();
    }

    private function monthlyExpenses(int $userId): array
    {
        return $this->expenseQuery($userId)
            ->selectRaw("DATE_FORMAT(COALESCE(expense_date, created_at), '%Y-%m') as month")
            ->selectRaw('SUM(amount) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->toArray();
    }

    private function success(string $message, mixed $data = null): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ]);
    }
}
