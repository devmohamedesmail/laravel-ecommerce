<?php
namespace App\Models;

use App\Models\Attribute;
use App\Models\ProductImage;
use App\Models\Variant;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;

    protected $fillable = [
        'store_id', 'category_id', 'title', 'slug', 'description', 'sku',
        'price', 'sale_price', 'product_type', 'product_kind',
        'stock', 'is_active', 'is_popular', 'is_featured',
        'weight', 'length', 'width', 'height', 'tax', 'shipping_cost',
    ];

    protected $casts = [
        'price'         => 'decimal:2',
        'sale_price'    => 'decimal:2',
        'weight'        => 'decimal:2',
        'length'        => 'decimal:2',
        'width'         => 'decimal:2',
        'height'        => 'decimal:2',
        'tax'           => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'is_active'     => 'boolean',
        'is_popular'    => 'boolean',
        'is_featured'   => 'boolean',
    ];

    /**
     * - relation with store [one to many]
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * - relation with category [one to many]
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
/**
 * - relation with images [one to many]
 */
    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('order');
    }

    /**
     * - relation with attribute [many to many]
     */
    public function attributes()
    {
        return $this->belongsToMany(Attribute::class, 'product_attributes');
    }

    /**
     * - relation with variants [one to many]
     */
    public function variants()
    {
        return $this->hasMany(Variant::class);
    }

    public function mainImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_main', true)->orWhere('order', 0);
    }

}
