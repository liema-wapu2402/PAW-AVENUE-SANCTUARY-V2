<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ResourceController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SiteController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public API  (visitor panel - no login required)
|--------------------------------------------------------------------------
*/
Route::get('/home', [SiteController::class, 'home']);
Route::get('/pets', [SiteController::class, 'pets']);
Route::get('/pets/{pet}', [SiteController::class, 'pet']);
Route::get('/vets', [SiteController::class, 'vets']);
Route::get('/services', [SiteController::class, 'services']);
Route::get('/news', [SiteController::class, 'news']);

Route::middleware('throttle:10,1')->group(function () {
    Route::post('/adoption-applications', [SiteController::class, 'storeApplication']);
    Route::post('/contact', [SiteController::class, 'storeContact']);
    Route::post('/appointments', [SiteController::class, 'storeAppointment']);
});

/*
|--------------------------------------------------------------------------
| Authentication  (admin panel sign-in)
|--------------------------------------------------------------------------
*/
Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:6,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
});

/*
|--------------------------------------------------------------------------
| Admin API  (token + admin role required)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/dashboard', DashboardController::class);

    $resources = 'pets|vets|services|testimonials|news|faqs|applications|messages|appointments';

    Route::get('/{resource}', [ResourceController::class, 'index'])->where('resource', $resources);
    Route::post('/{resource}', [ResourceController::class, 'store'])->where('resource', $resources);
    Route::match(['put', 'patch', 'post'], '/{resource}/{id}', [ResourceController::class, 'update'])
        ->where(['resource' => $resources, 'id' => '[0-9]+']);
    Route::delete('/{resource}/{id}', [ResourceController::class, 'destroy'])
        ->where(['resource' => $resources, 'id' => '[0-9]+']);
});
