<?php
namespace App\Http\Controllers\users;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class UsersController extends Controller
{
    //

    public function cart_page()
    {
        return Inertia::render('users/cart/index');
    }
    public function wishlist_page()
    {
        return Inertia::render('users/wishlist/index');
    }
    public function checkout_page()
    {
        return Inertia::render('users/checkout/index');
    }
}
