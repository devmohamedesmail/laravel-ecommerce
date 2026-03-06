<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeValue extends Model
{
    /** @use HasFactory<\Database\Factories\AttributeValueFactory> */
    use HasFactory;

    protected $fillable = ['attribute_id', 'product_id', 'value', 'price'];

    /**
     * relation with attribute [one to many]
     */
    public function attribute()
    {
        return $this->belongsTo(Attribute::class);
    }

    /**
     * relation with Variant [one to many]
     */
    public function variants()
    {
        return $this->belongsToMany(Variant::class, 'variant_attribute_values');
    }
}
