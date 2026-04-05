<?php

use App\Http\Controllers\PlaceController;
use App\Services\ObservabilityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Validator;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('import-places', [PlaceController::class, 'importPlaces']);

// Observabilidade: erros do frontend (throttle para evitar abuso)
Route::post('observability/errors', function (Request $request) {
    $v = Validator::make($request->all(), [
        'message' => 'required|string|max:65535',
        'url' => 'nullable|string|max:1000',
        'file' => 'nullable|string|max:500',
        'line' => 'nullable|integer',
        'stack' => 'nullable|string|max:10000',
        'level' => 'nullable|string|max:50',
        'meta' => 'nullable|array|max:40',
        'meta.*' => 'nullable|string|max:2000',
    ]);
    if ($v->fails()) {
        return response()->json(['message' => 'Invalid payload'], 422);
    }
    $data = $v->validated();
    $clientMeta = isset($data['meta']) && is_array($data['meta']) ? $data['meta'] : [];

    ObservabilityService::recordError('frontend', $data['message'], [
        'url' => $data['url'] ?? null,
        'file' => $data['file'] ?? null,
        'line' => $data['line'] ?? null,
        'stack' => $data['stack'] ?? null,
        'level' => $data['level'] ?? 'error',
        'client_meta' => $clientMeta,
    ]);

    return response()->json(['ok' => true], 201);
})->middleware('throttle:60,1'); // 60 por minuto
