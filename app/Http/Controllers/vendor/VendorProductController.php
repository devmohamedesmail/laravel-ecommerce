<?php
namespace App\Http\Controllers\vendor;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class VendorProductController extends Controller
{
    private function getStore()
    {
        return Store::where('user_id', auth()->id())->first();
    }

    public function index(Request $request)
    {
        $store = $this->getStore();

        if (! $store) {
            return redirect()->route('create-store.page');
        }

        $products = Product::where('store_id', $store->id)
            ->with('category:id,name_en,name_ar')
            ->latest()
            ->paginate(15);

        $categories = \App\Models\Category::where('is_active', true)
            ->get(['id', 'name_en', 'name_ar', 'parent_id']);

        return Inertia::render('vendor/products/index', [
            'store'      => $store,
            'products'   => $products,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $store = $this->getStore();

        if (! $store) {
            return response()->json(['error' => 'No store'], 403);
        }

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'sale_price'  => 'nullable|numeric|min:0',
            'stock'       => 'nullable|integer|min:0',
            'sku'         => 'nullable|string|max:100',
            'status'      => 'required|in:active,inactive,draft',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $data['store_id'] = $store->id;

        Product::create($data);

        return back()->with('success', 'Product created.');
    }

    public function update(Request $request, Product $product)
    {
        $store = $this->getStore();

        if (! $store || $product->store_id !== $store->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'sale_price'  => 'nullable|numeric|min:0',
            'stock'       => 'nullable|integer|min:0',
            'sku'         => 'nullable|string|max:100',
            'status'      => 'required|in:active,inactive,draft',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $product->update($data);

        return back()->with('success', 'Product updated.');
    }

    public function destroy(Product $product)
    {
        $store = $this->getStore();

        if (! $store || $product->store_id !== $store->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $product->delete();

        return back()->with('success', 'Product deleted.');
    }
}
