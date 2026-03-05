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

    // ─── Create store page ────────────────────────────────────────────────────

    public function CreateStorePage()
    {
        $categories = Category::where('is_active', true)
            ->get(['id', 'name_en', 'name_ar', 'parent_id']);

        return Inertia::render('vendor/create-store/index', [
            'categories' => $categories,
        ]);
    }

    // ─── Store a new store ────────────────────────────────────────────────────

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

        // Unique slug
        $base = Str::slug($request->name);
        $slug = $base;
        $i    = 1;
        while (Store::where('slug', $slug)->exists()) {
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
            'currency'    => $request->currency ?? 'USD',
            'timezone'    => $request->timezone ?? 'UTC',
            'logo'        => $logoUrl,
            'cover'       => $coverUrl,
            'status'      => 'active',
            'user_id'     => auth()->id(),
        ]);

        if ($request->categories) {
            $store->categories()->sync($request->categories);
        }

        return redirect()->route('vendor.dashboard')
            ->with('success', 'Store created successfully!');
    }

    // ─── Vendor dashboard ─────────────────────────────────────────────────────

    public function dashboard()
    {
        $store = Store::where('user_id', auth()->id())
            ->with(['categories'])
            ->first();

        if (! $store) {
            return redirect()->route('create-store.page');
        }

        $productCount  = \App\Models\Product::where('store_id', $store->id)->count();
        $categoryCount = $store->categories->count();

        return Inertia::render('vendor/dashboard/index', [
            'store'         => $store,
            'productCount'  => $productCount,
            'categoryCount' => $categoryCount,
        ]);
    }

    // ─── Settings page ────────────────────────────────────────────────────────

    public function settingsPage()
    {
        $store = Store::where('user_id', auth()->id())->first();

        if (! $store) {
            return redirect()->route('create-store.page');
        }

        $categories = Category::where('is_active', true)
            ->get(['id', 'name_en', 'name_ar', 'parent_id']);
        $storeCategories = $store->categories()->pluck('categories.id')->toArray();

        return Inertia::render('vendor/settings/index', [
            'store'           => $store,
            'categories'      => $categories,
            'storeCategories' => $storeCategories,
        ]);
    }

    // ─── Update store ─────────────────────────────────────────────────────────

    public function updateStore(Request $request)
    {
        $store = Store::where('user_id', auth()->id())->first();

        if (! $store) {
            return response()->json(['error' => 'No store found'], 403);
        }

        $data = $request->validate([
            'name'         => 'required|string|max:255|unique:stores,name,' . $store->id,
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

        if ($request->hasFile('logo')) {
            $data['logo'] = $this->uploadToCloudinary($request->file('logo'), 'stores/logos');
        } else {
            unset($data['logo']);
        }

        if ($request->hasFile('cover')) {
            $data['cover'] = $this->uploadToCloudinary($request->file('cover'), 'stores/covers');
        } else {
            unset($data['cover']);
        }

        $store->update($data);

        if (isset($data['categories'])) {
            $store->categories()->sync($data['categories']);
        }

        return back()->with('success', 'Store updated successfully.');
    }
}
