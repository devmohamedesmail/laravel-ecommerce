<?php
namespace App\Models;

use App\Models\AttributeValue;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    /** @use HasFactory<\Database\Factories\AttributeFactory> */
    use HasFactory;
/**
 * relation with products [many to many]
 */
    public function products()
    {
        return $this->belongsToMany(Product::class, 'product_attributes');
    }
/**
 * relation with values [one to many]
 */
    public function values()
    {
        return $this->hasMany(AttributeValue::class);
    }
}
