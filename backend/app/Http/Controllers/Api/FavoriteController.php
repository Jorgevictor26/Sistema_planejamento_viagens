<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class FavoriteController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success(
            'Favoritos encontrados com sucesso.',
            Favorite::query()->where('user_id', Auth::id())->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $favorite = Favorite::create([
            ...$request->validate([
                'title' => ['required', 'string', 'max:255'],
                'type' => ['required', 'string', 'max:80'],
                'image' => ['nullable', 'string', 'max:2048'],
                'location' => ['nullable', 'string', 'max:255'],
            ]),
            'user_id' => Auth::id(),
        ]);

        return $this->success('Favorito criado com sucesso.', $favorite, Response::HTTP_CREATED);
    }

    public function destroy(Favorite $favorite): JsonResponse
    {
        abort_if($favorite->user_id !== Auth::id(), Response::HTTP_FORBIDDEN);

        $favorite->delete();

        return $this->success('Favorito removido com sucesso.');
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
