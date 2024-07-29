<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdvertController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;

// Public routes
Route::get('/', function () {
    return Inertia::render('Home', [
        'title' => 'Home Landing Page',
        'auth' => ['user' => Auth::user()],
    ]);
});

// Other public routes...
Route::get('/about', function () {
    $user = Auth::user();
    $authData = $user ? [
        'user' => $user,
        'roles' => $user->getRoleNames()->toArray(),
    ] : null;

    return Inertia::render('About', [
        'title' => 'About Company Page',
        'auth' => $authData,
    ]);
});

Route::get('/contacts', function () {
    $user = Auth::user();
    $authData = $user ? [
        'user' => $user,
        'roles' => $user->getRoleNames()->toArray(),
    ] : null;

    return Inertia::render('ContactUs', [
        'title' => 'Contacts Company Page',
        'auth' => $authData,
    ]);
});

Route::get('/shop', [ShopController::class, 'shop'])->name('shop');
Route::get('/shop/{slug}', [ProductController::class, 'showDetail'])->name('show-detail.product');
Route::get('/shop/categories/{category}', [CategoryController::class, 'productShow'])->name('shop-categories.show');

//Blogs
Route::get('/blog', [BlogController::class, 'index'])->name('blogs.index');
Route::get('/blog/{slug}', [BlogController::class, 'show'])->name('blogs.show');


Route::resource('adverts', AdvertController::class);

// Orders
Route::middleware(['auth'])->group(function () {
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
    Route::post('/pesapal/initiate-payment', [PaymentController::class, 'initiatePayment']);
    Route::put('/orders/{order}', [OrderController::class, 'update'])->name('orders.update');
    Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');
    Route::post('/subscribe', [ContactController::class, 'subscribe'])->name('subscribe.store');

    Route::get('/checkout', function(){

        $user = Auth::user();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;
    
        return Inertia::render('CheckOut', [
            'title'=> 'Check out Place',
            'auth' => $authData,
        ]);
    });
});

// Backend routes for Admin and Staff
Route::middleware(['auth', 'role:admin|staff'])->prefix('admin')->group(function () {
    // Categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    
    // Adverts
    Route::get('/adverts', [AdvertController::class, 'index'])->name('admin.adverts.index');
    Route::get('/adverts/create', [AdvertController::class, 'create'])->name('admin.adverts.create');
    Route::post('/adverts', [AdvertController::class, 'store'])->name('admin.adverts.store');
    Route::get('/adverts/{advert}/edit', [AdvertController::class, 'edit'])->name('admin.adverts.edit');
    Route::put('/adverts/{advert}', [AdvertController::class, 'update'])->name('admin.adverts.update');
    Route::delete('/adverts/{advert}', [AdvertController::class, 'destroy'])->name('admin.adverts.destroy');

    // Admin Dashboard
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/create-product', [AdminController::class, 'showCreateProductForm'])->name('admin.show-create-product-form');
    Route::post('/create-product', [AdminController::class, 'createProduct'])->name('admin.create-product');
    Route::get('/edit-product/{id}', [AdminController::class, 'editProduct'])->name('admin.edit-product');
    Route::put('/update-product/{product}', [AdminController::class, 'updateProduct'])->name('admin.update-product');
    Route::delete('/delete-product/{id}', [AdminController::class, 'deleteProduct'])->name('admin.destroy-product');
    Route::post('/cancel-order/{id}', [AdminController::class, 'cancelOrder'])->name('admin.cancel-order');
    Route::post('/mark-order-seen/{id}', [AdminController::class, 'markOrderSeen'])->name('admin.mark-order-seen');
    Route::get('/product-trends', [OrderController::class, 'getChartData'])->name('product-trends.analytics');

    //Contact
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::put('/contacts/{contact}/toggle-seen', [ContactController::class, 'toggleSeen']);
    
});


Route::middleware(['auth', 'role:admin|staff'])->prefix('admin')->group(function () {
    // Blogs
    Route::get('/blogs/create', [BlogController::class, 'create'])->name('blogs.create');
    Route::post('/blogs', [BlogController::class, 'store'])->name('blogs.store');
    Route::get('/blogs/{slug}/edit', [BlogController::class, 'edit'])->name('blogs.edit');
    Route::put('/blogs/{slug}', [BlogController::class, 'update'])->name('blogs.update');
    Route::delete('/blogs/{slug}', [BlogController::class, 'destroy'])->name('blogs.destroy');

});




// Additional Admin-only routes
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin/users', [AdminController::class, 'listUsers'])->name('admin.users');
    Route::post('/admin/assign-role', [AdminController::class, 'assignRole'])->name('admin.assign-role');
    Route::get('/analytics', [AnalyticsController::class, 'index'])->name('analytics.index');
    Route::post('/users/{user}/toggle-role', [UserController::class, 'toggleRole']);
});

// Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

require __DIR__.'/auth.php';