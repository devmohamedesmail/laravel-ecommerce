<?php
namespace App\Http\Controllers\admin;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::latest()->paginate(10);

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:roles,slug',
            'description' => 'nullable|string|max:500',
            'is_active'   => 'boolean',
        ]);

        Role::create($data);

        return back()->with('success', 'Role created successfully.');
    }

    public function update(Request $request, Role $role)
    {
        $data = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'required|string|max:255|unique:roles,slug,' . $role->id,
            'description' => 'nullable|string|max:500',
            'is_active'   => 'boolean',
        ]);

        $role->update($data);

        return back()->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        $role->delete();

        return back()->with('success', 'Role deleted successfully.');
    }
}
