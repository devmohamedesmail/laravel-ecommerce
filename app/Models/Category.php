<?php
namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    /** @use HasFactory<\Database\Factories\CategoryFactory> */
    use HasFactory;

    protected $fillable = [
        'name_en', 'name_ar', 'slug', 'parent_id',
        'description_en', 'description_ar', 'image', 'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function stores()
    {
        return $this->belongsToMany(Store::class, 'category_store');
    }


    // relation with products
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
