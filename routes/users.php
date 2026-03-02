<?php

use App\Http\Controllers\users\UsersController;
use Illuminate\Support\Facades\Route;




Route::controller(UsersController::class)->group(function () {
    Route::get('/cart/page', 'cart_page')->name('cart_page');
    Route::get('/wishlist/page', 'wishlist_page')->name('wishlist_page');
    Route::get('/checkout/page', 'checkout_page')->name('checkout_page');
});