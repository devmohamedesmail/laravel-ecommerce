<?php
namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\UploadsToCloudinary;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    use UploadsToCloudinary;

    public function index()
    {
        $categories = Category::with('parent')
            ->latest()
            ->paginate(10);

        $parents = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->get(['id', 'name_en', 'name_ar']);

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'parents'    => $parents,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name_en'        => 'required|string|max:255',
            'name_ar'        => 'required|string|max:255',
            'slug'           => 'required|string|max:255|unique:categories,slug',
            'parent_id'      => 'nullable|exists:categories,id',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'image'          => 'nullable|image|max:2048',
            'is_active'      => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadToCloudinary($request->file('image'), 'categories');
        }

        Category::create($data);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name_en'        => 'required|string|max:255',
            'name_ar'        => 'required|string|max:255',
            'slug'           => 'required|string|max:255|unique:categories,slug,' . $category->id,
            'parent_id'      => 'nullable|exists:categories,id',
            'description_en' => 'nullable|string',
            'description_ar' => 'nullable|string',
            'image'          => 'nullable|image|max:2048',
            'is_active'      => 'boolean',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $this->uploadToCloudinary($request->file('image'), 'categories');
        } else {
            unset($data['image']);
        }

        $category->update($data);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }
}
