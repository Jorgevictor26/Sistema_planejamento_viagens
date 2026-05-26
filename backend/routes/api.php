<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ExpenseController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ItineraryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\PlaceController;
use App\Http\Controllers\Api\TripController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\WeatherController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/cities/search', [LocationController::class, 'search']);
Route::get('/weather', [WeatherController::class, 'current']);
Route::get('/places', [PlaceController::class, 'index']);
Route::get('/places/nearby', [PlaceController::class, 'nearby']);

Route::middleware(['jwt', 'throttle:60,1'])->group(function (): void {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/recent-trips', [DashboardController::class, 'recentTrips']);
    Route::get('/dashboard/expenses-summary', [DashboardController::class, 'expensesSummary']);
    Route::get('/export/trips.csv', [ExportController::class, 'tripsCsv']);
    Route::get('/export/expenses.csv', [ExportController::class, 'expensesCsv']);
    Route::get('/export/trips.pdf', [ExportController::class, 'tripsPdf']);
    Route::get('/export/expenses.pdf', [ExportController::class, 'expensesPdf']);
    Route::apiResource('trips', TripController::class);
    Route::apiResource('expenses', ExpenseController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('itineraries', ItineraryController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::apiResource('favorites', FavoriteController::class)->only(['index', 'store', 'destroy']);
    Route::apiResource('uploads', UploadController::class)->only(['index', 'store', 'destroy']);
});
