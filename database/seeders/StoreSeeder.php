<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StoreSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // جلب جميع user ids
        $userIds = DB::table('users')->pluck('id')->toArray();

        // لو حابب نعمل 20 متجر
        for ($i = 1; $i <= 20; $i++) {
            $name = "Store $i";
            $slug = Str::slug($name . '-' . $i); // لتجنب التعارض
            $user_id = $userIds[array_rand($userIds)]; // اختيار مالك عشوائي من users

            DB::table('stores')->insert([
                'name' => $name,
                'slug' => $slug,
                'logo' => "https://via.placeholder.com/150?text=Logo+$i",
                'cover' => "https://via.placeholder.com/600x200?text=Cover+$i",
                'description' => "This is a description for $name.",
                'phone' => '0123456789',
                'email' => "store{$i}@example.com",
                'address' => "Street $i, City",
                'city' => "City $i",
                'state' => "State $i",
                'zip' => "12345",
                'country' => 'Egypt',
                'currency' => 'EGP',
                'timezone' => 'Africa/Cairo',
                'status' => 'active',
                'user_id' => $user_id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
