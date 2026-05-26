<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Throwable;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create($request->validated());
        $token = Auth::guard('api')->login($user);

        return $this->success('Usuario registrado com sucesso.', [
            'user' => new UserResource($user),
            'authorization' => $this->authorization($token),
        ], Response::HTTP_CREATED);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $token = Auth::guard('api')->attempt($request->validated());

        if (! $token) {
            return $this->error('Email ou senha incorretos.', Response::HTTP_UNAUTHORIZED);
        }

        return $this->success('Login realizado com sucesso.', [
            'user' => new UserResource(Auth::guard('api')->user()),
            'authorization' => $this->authorization($token),
        ]);
    }

    public function logout(): JsonResponse
    {
        Auth::guard('api')->logout();

        return $this->success('Logout realizado com sucesso.');
    }

    public function me(): JsonResponse
    {
        return $this->success('Usuario autenticado.', [
            'user' => new UserResource(Auth::guard('api')->user()),
        ]);
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $status = Password::sendResetLink($request->validated());
        } catch (Throwable) {
            return $this->error('Nao foi possivel enviar o email de recuperacao. Verifique a configuracao de email do servidor.', Response::HTTP_SERVICE_UNAVAILABLE);
        }

        if ($status !== Password::RESET_LINK_SENT) {
            return $this->error(__($status), Response::HTTP_BAD_REQUEST);
        }

        return $this->success(__($status));
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->validated(),
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                ]);

                $user->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return $this->error(__($status), Response::HTTP_BAD_REQUEST);
        }

        return $this->success(__($status));
    }

    /**
     * @param  array<string, mixed>|null  $data
     */
    private function success(string $message, ?array $data = null, int $status = Response::HTTP_OK): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $status);
    }

    private function error(string $message, int $status): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null,
        ], $status);
    }

    /**
     * @return array<string, mixed>
     */
    private function authorization(string $token): array
    {
        return [
            'token' => $token,
            'type' => 'bearer',
            'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
        ];
    }
}
