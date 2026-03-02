<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('roles')->insert([
            ['id' => 1, 'name' => 'Admin', 'slug' => 'admin', 'description' => 'Administrator', 'is_active' => true],
            ['id' => 2, 'name' => 'User', 'slug' => 'user', 'description' => 'Regular user', 'is_active' => true],
            ['id' => 3, 'name' => 'Vendor', 'slug' => 'vendor', 'description' => 'Vendor user', 'is_active' => true],
        ]);
    }
}
