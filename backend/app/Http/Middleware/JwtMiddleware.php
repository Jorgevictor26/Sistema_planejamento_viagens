<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Facades\JWTAuth;

class JwtMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            if (! JWTAuth::parseToken()->authenticate()) {
                return $this->unauthorized('Usuario nao autenticado.');
            }
        } catch (TokenExpiredException) {
            return $this->unauthorized('Token expirado.');
        } catch (TokenInvalidException) {
            return $this->unauthorized('Token invalido.');
        } catch (JWTException) {
            return $this->unauthorized('Token nao informado.');
        }

        return $next($request);
    }

    private function unauthorized(string $message): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null,
        ], Response::HTTP_UNAUTHORIZED);
    }
}
