<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ExpenseResource;
use App\Models\Expense;
use App\Services\ExpenseService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class ExpenseController extends Controller
{
    public function __construct(private readonly ExpenseService $expenses) {}

    public function index(Request $request): JsonResponse
    {
        return $this->success('Despesas encontradas com sucesso.', ExpenseResource::collection($this->expenses->list(Auth::id(), $request->query()))->response()->getData(true));
    }

    public function store(Request $request): JsonResponse
    {
        return $this->success(
            'Despesa criada com sucesso.',
            new ExpenseResource($this->expenses->create(Auth::id(), $this->validated($request))),
            Response::HTTP_CREATED
        );
    }

    public function update(Request $request, Expense $expense): JsonResponse
    {
        return $this->success(
            'Despesa atualizada com sucesso.',
            new ExpenseResource($this->expenses->update(Auth::id(), $expense, $this->validated($request, true)))
        );
    }

    public function destroy(Expense $expense): JsonResponse
    {
        $this->expenses->delete(Auth::id(), $expense);

        return $this->success('Despesa removida com sucesso.');
    }

    private function validated(Request $request, bool $partial = false): array
    {
        $required = $partial ? 'sometimes' : 'required';

        return $request->validate([
            'trip_id' => [$required, 'integer', 'exists:trips,id'],
            'category' => [$required, 'string', Rule::in(Expense::CATEGORIES)],
            'amount' => [$required, 'numeric', 'min:0'],
            'description' => ['nullable', 'string', 'max:255'],
            'expense_date' => ['nullable', 'date'],
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
