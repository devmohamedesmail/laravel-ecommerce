<?php

use App\Http\Controllers\users\RedirectController;
use Illuminate\Support\Facades\Route;

Route::controller(RedirectController::class)->group(function () {
    Route::get('/', 'index')->name('home');
    Route::get('dashboard', 'redirect_user')->middleware(['auth', 'verified'])->name('dashboard');
});
