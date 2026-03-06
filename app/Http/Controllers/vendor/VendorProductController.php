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
            ->with(['category:id,name_en,name_ar', 'images', 'variants.attributeValues.attribute'])
            ->latest()
            ->paginate(15);

        $categories = $store->categories()->where('is_active', true)
            ->get(['categories.id', 'categories.name_en', 'categories.name_ar', 'categories.parent_id']);

        $attributes = \App\Models\Attribute::with('values')->get();

        return Inertia::render('vendor/products/index', [
            'store'      => $store,
            'products'   => $products,
            'categories' => $categories,
            'attributes' => $attributes,
        ]);
    }

    public function store(Request $request)
    {
        $store = $this->getStore();

        if (! $store) {
            return response()->json(['error' => 'No store'], 403);
        }

        $data = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'sale_price'    => 'nullable|numeric|min:0',
            'product_type'  => 'required|in:simple,variant',
            'product_kind'  => 'required|in:physical,digital',
            'stock'         => 'nullable|integer|min:0',
            'sku'           => 'nullable|string|max:100',
            'is_active'     => 'boolean',
            'is_popular'    => 'boolean',
            'is_featured'   => 'boolean',
            'weight'        => 'nullable|numeric|min:0',
            'length'        => 'nullable|numeric|min:0',
            'width'         => 'nullable|numeric|min:0',
            'height'        => 'nullable|numeric|min:0',
            'tax'           => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'category_id'   => 'required|exists:categories,id',
            'images.*'      => 'nullable|image|max:2048',
            'variants'      => 'nullable|array',
        ]);

        $data['store_id'] = $store->id;
        $data['slug']     = \Illuminate\Support\Str::slug($data['title']) . '-' . uniqid();

        $product = Product::create($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image' => $path,
                    'order' => $index,
                ]);
            }
        }

        if ($data['product_type'] === 'variant' && ! empty($data['variants'])) {
            foreach ($data['variants'] as $vData) {
                $variant = $product->variants()->create([
                    'sku'        => $vData['sku'] ?? null,
                    'price'      => $vData['price'],
                    'sale_price' => $vData['sale_price'] ?? null,
                    'stock'      => $vData['stock'] ?? 0,
                    'is_active'  => $vData['is_active'] ?? true,
                ]);

                if (! empty($vData['attribute_values'])) {
                    // Expecting $vData['attribute_values'] to be an array of attribute_value IDs
                    $variant->attributeValues()->attach($vData['attribute_values']);
                }
            }
        }

        return back()->with('success', 'Product created.');
    }

    public function update(Request $request, Product $product)
    {
        $store = $this->getStore();

        if (! $store || $product->store_id !== $store->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = $request->validate([
            'title'         => 'required|string|max:255',
            'description'   => 'nullable|string',
            'price'         => 'required|numeric|min:0',
            'sale_price'    => 'nullable|numeric|min:0',
            'product_type'  => 'required|in:simple,variant',
            'product_kind'  => 'required|in:physical,digital',
            'stock'         => 'nullable|integer|min:0',
            'sku'           => 'nullable|string|max:100',
            'is_active'     => 'boolean',
            'is_popular'    => 'boolean',
            'is_featured'   => 'boolean',
            'weight'        => 'nullable|numeric|min:0',
            'length'        => 'nullable|numeric|min:0',
            'width'         => 'nullable|numeric|min:0',
            'height'        => 'nullable|numeric|min:0',
            'tax'           => 'nullable|numeric|min:0',
            'shipping_cost' => 'nullable|numeric|min:0',
            'category_id'   => 'required|exists:categories,id',
            'images.*'      => 'nullable|image|max:2048',
            'variants'      => 'nullable|array',
        ]);

        if ($product->title !== $data['title']) {
            $data['slug'] = \Illuminate\Support\Str::slug($data['title']) . '-' . uniqid();
        }

        $product->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $file) {
                $path = $file->store('products', 'public');
                $product->images()->create([
                    'image' => $path,
                    'order' => $product->images()->max('order') + 1 + $index,
                ]);
            }
        }

        if ($data['product_type'] === 'variant' && ! empty($data['variants'])) {
            // Delete old variants and sync new ones to avoid UI complexity in this iteration
            $product->variants()->delete();

            foreach ($data['variants'] as $vData) {
                $variant = $product->variants()->create([
                    'sku'        => $vData['sku'] ?? null,
                    'price'      => $vData['price'],
                    'sale_price' => $vData['sale_price'] ?? null,
                    'stock'      => $vData['stock'] ?? 0,
                    'is_active'  => $vData['is_active'] ?? true,
                ]);

                if (! empty($vData['attribute_values'])) {
                    $variant->attributeValues()->attach($vData['attribute_values']);
                }
            }
        } elseif ($data['product_type'] === 'simple') {
            $product->variants()->delete();
        }

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
