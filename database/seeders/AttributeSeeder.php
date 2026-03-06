<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AttributeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         DB::table('attributes')->insert([
            [
                'name_ar' => 'الحجم',
                'name_en' => 'Size',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name_ar' => 'اللون',
                'name_en' => 'Color',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name_ar' => 'المقاس',
                'name_en' => 'Dimension',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
