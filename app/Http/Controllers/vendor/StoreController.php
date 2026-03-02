<?php
namespace App\Http\Controllers\vendor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Store;
use App\Traits\UploadsToCloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StoreController extends Controller
{
    use UploadsToCloudinary;

    public function CreateStorePage()
    {
        $categories = Category::where('is_active', true)
            ->get(['id', 'name_en', 'name_ar', 'parent_id']);

        return Inertia::render('vendor/create-store/index', [
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'         => 'required|string|max:255|unique:stores,name',
            'description'  => 'nullable|string',
            'phone'        => 'nullable|string|max:30',
            'email'        => 'nullable|email|max:255',
            'address'      => 'nullable|string|max:255',
            'city'         => 'nullable|string|max:100',
            'state'        => 'nullable|string|max:100',
            'zip'          => 'nullable|string|max:20',
            'country'      => 'nullable|string|max:100',
            'currency'     => 'nullable|string|max:10',
            'timezone'     => 'nullable|string|max:60',
            'logo'         => 'nullable|image|max:2048',
            'cover'        => 'nullable|image|max:4096',
            'categories'   => 'nullable|array',
            'categories.*' => 'exists:categories,id',
        ]);

        $base = Str::slug($request->name);
        $slug = $base;
        $i    = 1;
        while (\App\Models\Store::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }

        $logoUrl  = null;
        $coverUrl = null;

        if ($request->hasFile('logo')) {
            $logoUrl = $this->uploadToCloudinary($request->file('logo'), 'stores/logos');
        }

        if ($request->hasFile('cover')) {
            $coverUrl = $this->uploadToCloudinary($request->file('cover'), 'stores/covers');
        }

        $store = Store::create([
            'name'        => $request->name,
            'slug'        => $slug,
            'description' => $request->description,
            'phone'       => $request->phone,
            'email'       => $request->email,
            'address'     => $request->address,
            'city'        => $request->city,
            'state'       => $request->state,
            'zip'         => $request->zip,
            'country'     => $request->country,
            'currency'    => $request->currency,
            'timezone'    => $request->timezone,
            'logo'        => $logoUrl,
            'cover'       => $coverUrl,
            'status'      => 'active',
            'user_id'     => auth()->id(),
        ]);

        if ($request->categories) {
            $store->categories()->sync($request->categories);
        }

        return redirect()->route('create-store.page')
            ->with('success', 'Store created successfully!');
    }
}
