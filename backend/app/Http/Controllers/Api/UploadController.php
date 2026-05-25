<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Upload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class UploadController extends Controller
{
    public function index(): JsonResponse
    {
        return $this->success(
            'Uploads encontrados com sucesso.',
            Upload::query()->where('user_id', Auth::id())->latest()->get()
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:jpg,jpeg,png,webp,pdf,doc,docx,txt', 'max:10240'],
            'file_type' => ['required', 'string', Rule::in(Upload::TYPES)],
        ]);

        $path = $validated['file']->store("uploads/{$validated['file_type']}", 'public');

        $upload = Upload::create([
            'user_id' => Auth::id(),
            'file_name' => $validated['file']->getClientOriginalName(),
            'file_path' => $path,
            'file_type' => $validated['file_type'],
        ]);

        return $this->success('Arquivo enviado com sucesso.', $upload, Response::HTTP_CREATED);
    }

    public function destroy(Upload $upload): JsonResponse
    {
        abort_if($upload->user_id !== Auth::id(), Response::HTTP_FORBIDDEN);

        Storage::disk('public')->delete($upload->file_path);
        $upload->delete();

        return $this->success('Upload removido com sucesso.');
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
