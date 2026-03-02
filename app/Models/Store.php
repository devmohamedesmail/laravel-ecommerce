<?php
namespace App\Models;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    /** @use HasFactory<\Database\Factories\StoreFactory> */
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'logo', 'cover', 'description',
        'phone', 'email', 'address', 'city', 'state',
        'zip', 'country', 'currency', 'timezone', 'status', 'user_id',
    ];

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_store');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
