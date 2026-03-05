<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
       $roles = [1, 2, 3]; // 1=Admin, 2=Moderator, 3=Customer/Vendor
        $password = '$2y$12$yuKsfw0BMjHhitLtUe8D4eKHlHM/id7v/a29W4cA3nQAT2PbaXUki';

        for ($i = 1; $i <= 50; $i++) {
            // Random role, مع التأكد من بعض Vendors
            $role_id = $roles[array_rand($roles)];

            // Generate random name & email
            $name = "User $i";
            $email = "user{$i}@example.com";

            DB::table('users')->insert([
                'name' => $name,
                'email' => $email,
                'password' => $password,
                'role_id' => $role_id,
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
