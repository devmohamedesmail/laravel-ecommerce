🛒 E-Commerce Platform

Laravel 12 + React + Inertia.js

A modern full-stack E-Commerce web application built using Laravel 12, React, and Inertia.js.
The platform provides a seamless shopping experience with a powerful admin dashboard and secure payment integration.

🚀 Tech Stack

Backend: PHP 8.x, Laravel 12

Frontend: React.js

Bridge: Inertia.js

Database: MySQL

Authentication: Laravel Fortify / Sanctum

Styling: Tailwind CSS

Payments: Stripe (optional)

Real-time (optional): Laravel Reverb / WebSockets

✨ Features
👤 User Features

User registration & login

Browse products by category

Add to cart

Secure checkout

Online payment integration (Stripe)

Order history

Responsive design

🛠 Admin Features

Dashboard overview

Manage products (CRUD)

Manage categories

Manage users

Manage orders

Real-time order updates (WebSockets)

📦 Installation Guide
1️⃣ Clone the Repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
2️⃣ Install Backend Dependencies
composer install
3️⃣ Install Frontend Dependencies
npm install
4️⃣ Environment Setup

Copy .env.example to .env

cp .env.example .env

Update your database credentials inside .env:

DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
5️⃣ Generate Application Key
php artisan key:generate
6️⃣ Run Migrations
php artisan migrate

(Optional: Seed database)

php artisan db:seed
7️⃣ Run the Application

Start Laravel server:

php artisan serve

Start Vite dev server:

npm run dev
📂 Project Structure
app/
resources/
  ├── js/
  │   ├── Pages/
  │   ├── Components/
routes/
database/

app/ → Backend logic

resources/js/ → React frontend

routes/web.php → Application routes

💳 Payment Integration (Stripe)

Add your Stripe keys in .env:

STRIPE_KEY=your_key
STRIPE_SECRET=your_secret
🔐 Authentication

Authentication is handled using Laravel Fortify / Sanctum with Inertia.js integration.

📸 Screenshots

Add screenshots of your homepage, dashboard, and checkout here.

🌍 Deployment

For production:

npm run build
php artisan config:cache
php artisan route:cache
php artisan view:cache

Make sure to:

Set APP_ENV=production

Set APP_DEBUG=false

📌 Future Improvements

Wishlist feature

Product reviews & ratings

Multi-vendor support

Coupon & discount system

Multi-language support

👨‍💻 Author

Mohamed Esmail
Full Stack Developer

📄 License

This project is open-source and available under the MIT License.

If you want, I can also:

🔥 Make a more professional README for recruiters

📈 Optimize it for GitHub SEO

🏆 Make it strong enough for your portfolio

🧠 Add system architecture diagram section

💼 Customize it for your LinkedIn profile


