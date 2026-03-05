<?php
namespace App\Http\Controllers\users;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RedirectController extends Controller
{
    //

    public function index()
    {
        return Inertia::render('index');
    }

    public function redirect_user()
    {
        try {
            $user = Auth::user();
            switch ($user->role_id) {
                case 1: // admin
                  
                    return Inertia::render('dashboard');
                    // return redirect()->route('admin.dashboard');
                    break;

                case 2: // user
                    return Inertia::render('index');
                    break;

                case 3: // vendor
                    return Inertia::render('vendor/dashboard/index');
                    break;

                default:
                     return Inertia::render('index');
                    // return redirect()->route('login');
            }
        } catch (\Throwable $th) {
            return Inertia::render("404/index", [
                "error" => $th->getMessage(),
            ]);
        }
    }
}
