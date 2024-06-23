<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\AdvertController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;

Route::get('/', function () {
    return Inertia::render('Home', [
        'title' => 'Home Landing Page',
        'auth' => [
            'user' => Auth::user()
        ],
        // other props
    ]);
});


Route::get('/about', function () {
    return Inertia::render('About', [
        'title' => 'About Company Page',
        'auth' => [
            'user' => Auth::user()
        ],
        // other props
    ]);
});


Route::get('/contacts', function () {
    return Inertia::render('ContactUs', [
        'title' => 'Contacts Company Page',
        'auth' => [
            'user' => Auth::user()
        ],
        // other props
    ]);
});

Route::get('/shop', [ShopController::class, 'shop'])->name('shop');

Route::get('/checkout', function(){
    return Inertia::render('CheckOut', [
        'title'=> 'Check out Place',
        'auth' => [
            'user' => Auth::user()
        ],
    ]);
});

Route::resource('adverts', AdvertController::class);

//Orders

Route::middleware(['auth'])->group(function () {
    Route::get('/orders/create', [OrderController::class, 'create'])->name('orders.create');
    Route::post('/orders', [OrderController::class, 'store'])->name('orders.store');
});


//Categories 
Route::middleware(['auth'])->prefix('admin')->group(function () {

    // Route to show the list of categories
    Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');

    // Route to show the form for creating a new category
    Route::get('/categories/create', [CategoryController::class, 'create'])->name('categories.create');

    // Route to store a new category
    Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');

    // Route to show a specific category
    Route::get('/categories/{category}', [CategoryController::class, 'show'])->name('categories.show');

    // Route to show the form for editing a category
    Route::get('/categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');

    // Route to update a specific category
    Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');

    // Route to delete a specific category
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
});

//Adverts
Route::middleware(['auth'])->group(function () {
    Route::get('/adverts/create', function () {
        return Inertia::render('CreateAdvert');
    })->name('adverts.create');
});

//Admin
Route::get('/admin', function(){
    return Inertia::render('Admin', [
        'title'=> 'Admin Place',
        'auth' => [
            'user' => Auth::user()
        ],
    ]);
})->name('admin.dashboard');


//Logout
Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');


// Admin Dashboard
Route::middleware(['auth'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/admin/create-product', [AdminController::class, 'showCreateProductForm'])->name('admin.show-create-product-form');
    Route::post('/admin/create-product', [AdminController::class, 'createProduct'])->name('admin.create-product');
    Route::get('/admin/edit-product/{id}', [AdminController::class, 'editProduct'])->name('admin.edit-product');
    // Route::put('/admin/update-product/{id}', [AdminController::class, 'updateProduct'])->name('admin.update-product');
    Route::put('/admin/update-product/{product}', [AdminController::class, 'updateProduct'])->name('update-product');
    Route::delete('/admin/delete-product/{id}', [AdminController::class, 'deleteProduct'])->name('admin.destroy-product');
    Route::post('/admin/cancel-order/{id}', [AdminController::class, 'cancelOrder'])->name('admin.cancel-order');
    Route::post('/admin/mark-order-seen/{id}', [AdminController::class, 'markOrderSeen'])->name('admin.mark-order-seen');
});


// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::resource('orders', OrderController::class);
//     Route::resource('products', ProductController::class);
//     Route::resource('categories', CategoryController::class);
// });




//Admin Advert Routes
Route::prefix('admin')->group(function () {
    Route::get('adverts', [AdvertController::class, 'index'])->name('admin.adverts.index');
    Route::get('adverts/create', [AdvertController::class, 'create'])->name('admin.adverts.create');
    Route::post('adverts', [AdvertController::class, 'store'])->name('admin.adverts.store');
    Route::get('adverts/{advert}/edit', [AdvertController::class, 'edit'])->name('admin.adverts.edit');
    Route::put('adverts/{advert}', [AdvertController::class, 'update'])->name('admin.adverts.update');
    Route::delete('adverts/{advert}', [AdvertController::class, 'destroy'])->name('admin.adverts.destroy');
});

require __DIR__.'/auth.php';

