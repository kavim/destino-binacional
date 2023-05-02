<?php

use App\Http\Controllers\EventController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Site\HomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('places', PlaceController::class);
    Route::resource('events', EventController::class);
});

// SITE ROUTES
Route::get('/c/{CategoryParentIdentifier}', [\App\Http\Controllers\Site\PlaceController::class, 'getByCategoryParentID'])->name('site.categories.show');

Route::get('/p/{PlaceIdentifier}', [\App\Http\Controllers\Site\PlaceController::class, 'getByPlaceIdentifier'])->name('places.byPlaceIdentifier');

Route::get('/eventos', [\App\Http\Controllers\Site\EventController::class, 'index'])->name('site.events.index');
Route::get('/eventos/{slug}', [\App\Http\Controllers\Site\EventController::class, 'show'])->name('site.events.show');

// Route::get('/search', [\App\Http\Controllers\Site\SearchController::class, 'index'])->name('search.index');

Route::get('change-language/{lang}', [App\Http\Controllers\Site\LocalizationController::class, 'changeLanguage'])->name('change-language');

require __DIR__.'/auth.php';
