<?php

use App\Http\Controllers\vendor\StoreController;
use Illuminate\Support\Facades\Route;

Route::controller(StoreController::class)->middleware('auth')->group(function () {
    Route::get('/create-store/page', 'CreateStorePage')->name('create-store.page');
    Route::post('/create-store', 'store')->name('create-store.store');
});
