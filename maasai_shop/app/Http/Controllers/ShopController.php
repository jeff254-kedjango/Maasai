<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

use App\Models\Order;
use App\Models\Category;
use App\Models\Advert;

use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;
use App\Models\User;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ShopController extends Controller
{
    public function shop()
    {
        // Check if the user is authenticated
        $user = Auth::user();

        // Fetch data
        $orders = Order::orderBy('created_at', 'desc')->get();
        $products = Product::orderBy('updated_at', 'desc')->get();
        $newStock = Product::orderBy('updated_at', 'desc')->get();
        $categories = Category::orderBy('name')->get();
        $adverts = Advert::active()->orderBy('created_at', 'desc')->get();

        // Count new (unseen) orders
        $newOrders = Order::where('status', 'pending')->orderBy('created_at', 'desc')->count();
        $offers = Product::whereNotNull('sale_price')->orderBy('updated_at', 'asc')->get();

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('Shop', [
            'orders' => $orders,
            'products' => $products,
            'adverts' => $adverts,
            'categories' => $categories,
            'newOrders' => $newOrders,
            'newStock' => $newStock,
            'offers' => $offers,
            'auth' => $authData,
        ]);
    }
}