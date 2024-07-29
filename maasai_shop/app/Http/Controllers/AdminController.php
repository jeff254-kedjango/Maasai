<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Models\Order;
use App\Models\Category;
use App\Models\Advert;
use App\Models\Blog;
use App\Models\Subscription;
use App\Models\Contact;
use Illuminate\Support\Carbon;
use Spatie\Permission\Models\Role;
use App\Models\User;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    // Show the form to create a new product
    public function showCreateProductForm()
    {
        $user = Auth::user();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null; // Use the Auth facade to get the currently authenticated user
        $categories = Category::orderBy('name')->get();


        return Inertia::render('CreateProducts', [
            'info' => 'This is the Shopping page.',
            'auth' => $authData,
            'categories' => $categories,
            'flash' => session('flash', ['success' => session('success')]), // Pass flash message
        ]);
    }

    // Display the admin dashboard with various data
    public function dashboard()
    {
        $user = Auth::user();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null; // Use the Auth facade to get the currently authenticated user
        
        // Fetch data for the dashboard
        $orders = Order::with(['products', 'user'])->orderBy('created_at', 'desc')->get();
        $blogs = Blog::orderBy('created_at', 'desc')->get();
        $products = Product::orderBy('created_at', 'desc')->get();
        $categories = Category::orderBy('name')->get();
        $adverts = Advert::active()->orderBy('created_at', 'desc')->get();
        $subs = Subscription::orderBy('created_at', 'desc')->get();
        $contact = Contact::where('is_seen', false)->orderBy('created_at', 'desc')->get();
        $allContacts = Contact::orderBy('created_at', 'desc')->get();
        
        // Count new (unseen) orders
        $newOrders = Order::where('is_seen', false)->orderBy('created_at', 'desc')->count();
        
        // Fetch user permissions
        $permissions = $user->getAllPermissions()->pluck('name');
    
        $listOfUsers = User::with('roles')->orderBy('created_at', 'desc')->get();
    
        $today = Carbon::today();
    
        // Prepare data for new and returning users
        $dates = [];
        $newUsers = [];
        $returningUsers = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = $today->copy()->subDays($i)->format('Y-m-d');
            $dates[] = $date;
            
            // Count new users who registered on the date
            $newUsers[] = User::whereDate('created_at', $date)->count();
        
            // Count returning users who logged in on the date
            $returningUsers[] = User::whereDate('last_login_at', $date)
                                    ->whereDate('created_at', '<', $date)
                                    ->count();
        }
    
        // Fetch most sold products
        $mostSoldProductsQuery = Product::select('products.id', 'products.name', 'products.slug')
            ->join('order_product', 'products.id', '=', 'order_product.product_id')
            ->selectRaw('SUM(order_product.quantity) as total_quantity')
            ->groupBy('products.id', 'products.name', 'products.slug')
            ->orderByDesc('total_quantity');
        
        // Log the SQL query and bindings
        Log::info('Most Sold Products Query:', [
            'query' => $mostSoldProductsQuery->toSql(),
            'bindings' => $mostSoldProductsQuery->getBindings()
        ]);
        
        // Get the results
        $mostSoldProducts = $mostSoldProductsQuery->get();
    
        // Fetch re-ordered products
        $reOrderedProductsQuery = Product::select('products.id', 'products.name', 'products.slug')
            ->join('order_product', 'products.id', '=', 'order_product.product_id')
            ->selectRaw('COUNT(DISTINCT order_product.order_id) as re_order_count')
            ->groupBy('products.id', 'products.name', 'products.slug')
            ->orderByDesc('re_order_count');
        
        // Log the SQL query and bindings
        Log::info('Re Ordered Products Query:', [
            'query' => $reOrderedProductsQuery->toSql(),
            'bindings' => $reOrderedProductsQuery->getBindings()
        ]);
    
        // Get the results
        $reOrderedProducts = $reOrderedProductsQuery->get();
    
        // Fetch stock check data
        $stockCheckData = Product::orderBy('quantity', 'asc')->get();
        
        // Debug query
        Log::info('Stock Check Data Query:', ['query' => 'SELECT * FROM products ORDER BY quantity DESC']);
    
        // Build the product revenue query
        $productRevenueQuery = Product::select('products.id', 'products.name', 'products.price')
            ->join('order_product', 'products.id', '=', 'order_product.product_id')
            ->join('orders', 'orders.id', '=', 'order_product.order_id')
            ->selectRaw('SUM(order_product.quantity * products.price) as total_revenue')
            ->groupBy('products.id', 'products.name', 'products.price')
            ->orderByDesc('total_revenue');
    
        // Log the query for debugging
        Log::info('Product Revenue Query:', [
            'query' => $productRevenueQuery->toSql(),
            'bindings' => $productRevenueQuery->getBindings()
        ]);
    
        // Execute the query
        $productRevenue = $productRevenueQuery->get();
    
        // Combine most sold products and re-ordered products to determine trending products
        $trendingProducts = collect($mostSoldProducts)->map(function ($product) use ($reOrderedProducts) {
            $reOrderedProduct = $reOrderedProducts->firstWhere('id', $product->id);
            $reOrderCount = $reOrderedProduct ? $reOrderedProduct->re_order_count : 0;
    
            return [
                'id' => $product->id,
                'name' => $product->name,
                'total_quantity' => $product->total_quantity,
                're_order_count' => $reOrderCount,
                'trend_score' => $product->total_quantity * 0.42 + $reOrderCount * 0.58
            ];
        })->sortByDesc('trend_score')->values();
    
        return Inertia::render('Dashboard', [
            'info' => 'Welcome to your Admin Dashboard',
            'auth' => $authData,
            'orders' => $orders,
            'products' => $products,
            'adverts' => $adverts,
            'blogs' => $blogs,
            'categories' => $categories,
            'newOrders' => $newOrders,
            'user' => $user->only('id', 'name', 'roles'),
            'permissions' => $permissions,
    
            'dates' => $dates,
            'newUsers' => $newUsers,
            'returningUsers' => $returningUsers,
            'listOfUsers' => $listOfUsers,
            'mostSoldProducts' => $mostSoldProducts,
            'reOrderedProducts' => $reOrderedProducts,
            'stockCheckData' => $stockCheckData,
            'productRevenue' => $productRevenue,
            'trendingProducts' => $trendingProducts,
            'subs' => $subs,
            'contact' => $contact,
            'allContacts' => $allContacts,
        ]);
    }

    // Create a new product
    public function createProduct(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'quantity' => 'required|numeric',
            'image1' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image2' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image3' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image4' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:30000',
        ]);
    
        $product = Product::create($validated);
    
        // Handle image uploads
        if ($request->hasFile('image1')) {
            $product->image1 = $request->file('image1')->store('images', 'public');
        }
        if ($request->hasFile('image2')) {
            $product->image2 = $request->file('image2')->store('images', 'public');
        }
        if ($request->hasFile('image3')) {
            $product->image3 = $request->file('image3')->store('images', 'public');
        }
        if ($request->hasFile('image4')) {
            $product->image4 = $request->file('image4')->store('images', 'public');
        }

        if ($request->hasFile('video')) {
            $validatedData['video'] = $request->file('video')->store('images', 'public');
        }
    
        $product->save();
    
        session()->flash('success', 'Product created successfully.');
    
        return redirect()->route('dashboard');
    }

    // Show the form to edit an existing product
    public function editProduct($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::orderBy('name')->get();

        $user = Auth::user();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('ProductEdit', [
            'auth' => $authData,
            'product' => $product,
            'categories' => $categories,
        ]);
    }
    
    // Update an existing product
    public function updateProduct(Request $request, Product $product)
    {
        // Log the incoming request data
        Log::info('Update Product Request:', $request->all());

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'sale_price' => 'nullable|numeric',
            'category_id' => 'sometimes|required|exists:categories,id',
            'quantity' => 'sometimes|required|numeric',
            'image1' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image3' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image4' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:30000',
        ]);

        // Update only provided fields
        foreach ($validatedData as $key => $value) {
            $product->$key = $value;
        }

        // Check if each file field is present before updating it
        foreach (['image1', 'image2', 'image3', 'image4', 'video'] as $field) {
            if ($request->hasFile($field)) {
                $path = $request->file($field)->store('public/products');
                $product->$field = $path;

                // Log the file path
                Log::info("Updated $field path:", [$path]);
            }
        }

        // If an image field is not present in the request, retain the existing image
        foreach (['image1', 'image2', 'image3', 'image4', 'video'] as $field) {
            if (!$request->hasFile($field) && !$request->filled($field)) {
                // Retain the existing image path
                $product->$field = $product->getOriginal($field);
            }
        }

        $product->save();

        // Log the final product data
        Log::info('Updated Product:', $product->toArray());

        return redirect()->route('dashboard')->with('success', 'Product updated successfully!');
    }
    
    // Delete an existing product
    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
    
        session()->flash('success', 'Product deleted successfully.');
        return redirect()->route('dashboard');
    }
}