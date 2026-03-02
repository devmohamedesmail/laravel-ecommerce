<?php

namespace App\Models;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    /** @use HasFactory<\Database\Factories\StoreFactory> */
    use HasFactory;

    /*
    * Belongs to many categories
    */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_store');
    }
}
