<?php

use App\Http\Controllers\vendor\StoreController;
use App\Http\Controllers\vendor\VendorProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {

    // ─── Store creation ───────────────────────────────────────────────────────
    Route::controller(StoreController::class)->group(function () {
        Route::get('/create-store/page', 'CreateStorePage')->name('create-store.page');
        Route::post('/create-store', 'store')->name('create-store.store');
    });

    // ─── Vendor dashboard ─────────────────────────────────────────────────────
    Route::prefix('vendor')->name('vendor.')->group(function () {

        // Overview
        Route::get('/dashboard', [StoreController::class, 'dashboard'])->name('dashboard');

        // Products CRUD
        Route::get('/products', [VendorProductController::class, 'index'])->name('products.index');
        Route::post('/products', [VendorProductController::class, 'store'])->name('products.store');
        Route::put('/products/{product}', [VendorProductController::class, 'update'])->name('products.update');
        Route::delete('/products/{product}', [VendorProductController::class, 'destroy'])->name('products.destroy');

        // Categories (read-only view of store's categories)
        Route::get('/categories', function () {
            $store = \App\Models\Store::where('user_id', auth()->id())
                ->with('categories')
                ->first();

            if (! $store) {
                return redirect()->route('create-store.page');
            }

            return Inertia::render('vendor/categories/index', [
                'store'      => $store,
                'categories' => $store->categories,
            ]);
        })->name('categories.index');

        // Orders (mock — no orders table yet)
        Route::get('/orders', function () {
            $store = \App\Models\Store::where('user_id', auth()->id())->first();

            if (! $store) {
                return redirect()->route('create-store.page');
            }

            return Inertia::render('vendor/orders/index', [
                'store' => $store,
            ]);
        })->name('orders.index');

        // Settings
        Route::get('/settings', [StoreController::class, 'settingsPage'])->name('settings');
        Route::patch('/settings', [StoreController::class, 'updateStore'])->name('settings.update');
    });
});
