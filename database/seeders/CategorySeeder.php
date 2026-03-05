<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        // تعطيل الـforeign key مؤقتًا لمسح البيانات
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('categories')->delete();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // فئات رئيسية
        $mainCategories = [
            ['name_en'=>'Electronics','name_ar'=>'الإلكترونيات','slug'=>'electronics','description_en'=>'Electronic devices and gadgets','description_ar'=>'الأجهزة الإلكترونية','image'=>'https://images.unsplash.com/photo-1519389950473-47ba0277781c','is_active'=>1],
            ['name_en'=>'Fashion','name_ar'=>'الأزياء','slug'=>'fashion','description_en'=>'Clothing and fashion products','description_ar'=>'الملابس والموضة','image'=>'https://images.unsplash.com/photo-1445205170230-053b83016050','is_active'=>1],
            ['name_en'=>'Home & Kitchen','name_ar'=>'المنزل والمطبخ','slug'=>'home-kitchen','description_en'=>'Home appliances and kitchen items','description_ar'=>'أدوات المنزل والمطبخ','image'=>'https://images.unsplash.com/photo-1556911220-e15b29be8c8f','is_active'=>1],
            ['name_en'=>'Beauty','name_ar'=>'الجمال','slug'=>'beauty','description_en'=>'Beauty and personal care','description_ar'=>'منتجات التجميل والعناية','image'=>'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9','is_active'=>1],
            ['name_en'=>'Sports','name_ar'=>'الرياضة','slug'=>'sports','description_en'=>'Sports equipment','description_ar'=>'معدات رياضية','image'=>'https://images.unsplash.com/photo-1517649763962-0c623066013b','is_active'=>1],
            ['name_en'=>'Books','name_ar'=>'الكتب','slug'=>'books','description_en'=>'Books and education','description_ar'=>'الكتب والتعليم','image'=>'https://images.unsplash.com/photo-1512820790803-83ca734da794','is_active'=>1],
            ['name_en'=>'Toys','name_ar'=>'الألعاب','slug'=>'toys','description_en'=>'Kids toys','description_ar'=>'ألعاب الأطفال','image'=>'https://images.unsplash.com/photo-1558060370-d644479cb6f7','is_active'=>1],
            ['name_en'=>'Automotive','name_ar'=>'السيارات','slug'=>'automotive','description_en'=>'Car accessories','description_ar'=>'إكسسوارات السيارات','image'=>'https://images.unsplash.com/photo-1493238792000-8113da705763','is_active'=>1],
            ['name_en'=>'Groceries','name_ar'=>'البقالة','slug'=>'groceries','description_en'=>'Food and groceries','description_ar'=>'الطعام والبقالة','image'=>'https://images.unsplash.com/photo-1542838132-92c53300491e','is_active'=>1],
            ['name_en'=>'Pet Supplies','name_ar'=>'مستلزمات الحيوانات','slug'=>'pet-supplies','description_en'=>'Pet products','description_ar'=>'منتجات الحيوانات','image'=>'https://images.unsplash.com/photo-1518717758536-85ae29035b6d','is_active'=>1],
        ];

        // إدراج الفئات الرئيسية واسترجاع IDs
        $mainCategoryIds = [];
        foreach ($mainCategories as $cat) {
            $id = DB::table('categories')->insertGetId($cat);
            $mainCategoryIds[$cat['slug']] = $id;
        }

        // Subcategories
        $subCategories = [
            // Electronics
            ['name_en'=>'Mobile Phones','name_ar'=>'الهواتف','slug'=>'mobile-phones','parent_slug'=>'electronics','image'=>'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9'],
            ['name_en'=>'Laptops','name_ar'=>'اللاب توب','slug'=>'laptops','parent_slug'=>'electronics','image'=>'https://images.unsplash.com/photo-1496181133206-80ce9b88a853'],
            ['name_en'=>'Headphones','name_ar'=>'سماعات','slug'=>'headphones','parent_slug'=>'electronics','image'=>'https://images.unsplash.com/photo-1518444065439-e933c06ce9cd'],
            ['name_en'=>'Smart Watches','name_ar'=>'الساعات الذكية','slug'=>'smart-watches','parent_slug'=>'electronics','image'=>'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b'],

            // Fashion
            ['name_en'=>'Men Clothing','name_ar'=>'ملابس رجالي','slug'=>'men-clothing','parent_slug'=>'fashion','image'=>'https://images.unsplash.com/photo-1520975922203-bf9d3b8a4c63'],
            ['name_en'=>'Women Clothing','name_ar'=>'ملابس نسائي','slug'=>'women-clothing','parent_slug'=>'fashion','image'=>'https://images.unsplash.com/photo-1483985988355-763728e1935b'],
            ['name_en'=>'Shoes','name_ar'=>'الأحذية','slug'=>'shoes','parent_slug'=>'fashion','image'=>'https://images.unsplash.com/photo-1542291026-7eec264c27ff'],
            ['name_en'=>'Bags','name_ar'=>'الحقائب','slug'=>'bags','parent_slug'=>'fashion','image'=>'https://images.unsplash.com/photo-1590874103328-eac38a683ce7'],

            // Home & Kitchen
            ['name_en'=>'Furniture','name_ar'=>'الأثاث','slug'=>'furniture','parent_slug'=>'home-kitchen','image'=>'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85'],
            ['name_en'=>'Kitchen Tools','name_ar'=>'أدوات المطبخ','slug'=>'kitchen-tools','parent_slug'=>'home-kitchen','image'=>'https://images.unsplash.com/photo-1506368083636-6defb67639a7'],
            ['name_en'=>'Cookware','name_ar'=>'أواني الطهي','slug'=>'cookware','parent_slug'=>'home-kitchen','image'=>'https://images.unsplash.com/photo-1584990347449-9a8b9d6c5f3c'],
            ['name_en'=>'Home Decor','name_ar'=>'ديكور المنزل','slug'=>'home-decor','parent_slug'=>'home-kitchen','image'=>'https://images.unsplash.com/photo-1493666438817-866a91353ca9'],

            // Beauty
            ['name_en'=>'Makeup','name_ar'=>'مكياج','slug'=>'makeup','parent_slug'=>'beauty','image'=>'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9'],
            ['name_en'=>'Skincare','name_ar'=>'العناية بالبشرة','slug'=>'skincare','parent_slug'=>'beauty','image'=>'https://images.unsplash.com/photo-1556228724-4c7f2c30c9a1'],
            ['name_en'=>'Perfumes','name_ar'=>'العطور','slug'=>'perfumes','parent_slug'=>'beauty','image'=>'https://images.unsplash.com/photo-1585386959984-a4155224a1ad'],
            ['name_en'=>'Hair Care','name_ar'=>'العناية بالشعر','slug'=>'hair-care','parent_slug'=>'beauty','image'=>'https://images.unsplash.com/photo-1522338140262-f46f5913618a'],

            // Sports
            ['name_en'=>'Gym Equipment','name_ar'=>'معدات الجيم','slug'=>'gym-equipment','parent_slug'=>'sports','image'=>'https://images.unsplash.com/photo-1517836357463-d25dfeac3438'],
            ['name_en'=>'Football','name_ar'=>'كرة القدم','slug'=>'football','parent_slug'=>'sports','image'=>'https://images.unsplash.com/photo-1508098682722-e99c43a406b2'],
            ['name_en'=>'Running','name_ar'=>'الجري','slug'=>'running','parent_slug'=>'sports','image'=>'https://images.unsplash.com/photo-1552674605-db6ffd4facb5'],
            ['name_en'=>'Cycling','name_ar'=>'الدراجات','slug'=>'cycling','parent_slug'=>'sports','image'=>'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8'],

            // Books
            ['name_en'=>'Novels','name_ar'=>'روايات','slug'=>'novels','parent_slug'=>'books','image'=>'https://images.unsplash.com/photo-1519681393784-d120267933ba'],
            ['name_en'=>'Education','name_ar'=>'تعليم','slug'=>'education','parent_slug'=>'books','image'=>'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f'],
            ['name_en'=>'Business','name_ar'=>'أعمال','slug'=>'business','parent_slug'=>'books','image'=>'https://images.unsplash.com/photo-1553729459-efe14ef6055d'],
            ['name_en'=>'Technology','name_ar'=>'تكنولوجيا','slug'=>'technology','parent_slug'=>'books','image'=>'https://images.unsplash.com/photo-1518770660439-4636190af475'],

            // Toys
            ['name_en'=>'Action Figures','name_ar'=>'شخصيات لعب','slug'=>'action-figures','parent_slug'=>'toys','image'=>'https://images.unsplash.com/photo-1595433707802-4e60f02f79c1'],
            ['name_en'=>'Puzzles','name_ar'=>'الألغاز','slug'=>'puzzles','parent_slug'=>'toys','image'=>'https://images.unsplash.com/photo-1605551233568-c7a1f86f77f4'],
            ['name_en'=>'Board Games','name_ar'=>'ألعاب الطاولة','slug'=>'board-games','parent_slug'=>'toys','image'=>'https://images.unsplash.com/photo-1606813908624-3e0a7b09158a'],
            ['name_en'=>'Dolls','name_ar'=>'دمى','slug'=>'dolls','parent_slug'=>'toys','image'=>'https://images.unsplash.com/photo-1580910051072-4039b00f52e7'],
        ];

        // إدراج Subcategories
        foreach ($subCategories as $sub) {
            DB::table('categories')->insert([
                'name_en'=>$sub['name_en'],
                'name_ar'=>$sub['name_ar'],
                'slug'=>$sub['slug'],
                'parent_id'=>$mainCategoryIds[$sub['parent_slug']], // ID حقيقي
                'description_en'=>$sub['name_en'].' category',
                'description_ar'=>'قسم '.$sub['name_ar'],
                'image'=>$sub['image'],
                'is_active'=>1
            ]);
        }
    }
}
