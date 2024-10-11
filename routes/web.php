<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\PlaceController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\LocalizationController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TourController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/home', [HomeController::class, 'index'])->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('places', PlaceController::class);
    Route::resource('events', EventController::class);
    Route::resource('tags', TagController::class);
    Route::resource('tours', TourController::class);
    Route::resource('categories', CategoryController::class);
});

// SITE ROUTES
Route::get('/c/{CategoryParentIdentifier}', [\App\Http\Controllers\Site\PlaceController::class, 'getByCategoryParentID'])->name('site.categories.show');

Route::get('/p/{PlaceIdentifier}', [\App\Http\Controllers\Site\PlaceController::class, 'getByPlaceIdentifier'])->name('places.byPlaceIdentifier');

Route::get('/eventos', [\App\Http\Controllers\Site\EventController::class, 'index'])->name('site.events.index');
Route::get('/eventos/{slug}', [\App\Http\Controllers\Site\EventController::class, 'show'])->name('site.events.show');

Route::get('/t', [\App\Http\Controllers\Site\TourController::class, 'index'])->name('site.tours.index');
Route::get('/t/{slug}', [\App\Http\Controllers\Site\TourController::class, 'show'])->name('site.tours.show');

// Route::get('/search', [\App\Http\Controllers\Site\SearchController::class, 'index'])->name('search.index'); // this guy is gold

Route::get('change-language/{lang}', [LocalizationController::class, 'changeLanguage'])->name('change-language');

//privacyPolicy
Route::get('/privacy-policy', [HomeController::class, 'privacyPolicy'])->name('privacy-policy');

require __DIR__.'/auth.php';
