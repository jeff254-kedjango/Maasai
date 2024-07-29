<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

use Inertia\Inertia;

use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    // Display a listing of the orders
    public function index()
    {
        $orders = Order::with('products')->get();
        return Inertia::render('Orders/Index', ['orders' => $orders]);
    }

    // Show the form for creating a new order
    public function create()
    {
        $user = Auth::user();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        $products = Product::all();
        return Inertia::render('CheckOut', [
            'auth' => $authData,
        ]);
    }

    // Store a newly created order in storage
    public function store(Request $request)
    {
        // Log the incoming request data
        Log::info('Order store request received', $request->all());

        // Validate the incoming request data
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total' => 'required|numeric',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $products = $request->products;

        // Log the products to be ordered
        Log::info('Products in order', $products);

        // Check if requested quantities are available
        foreach ($products as $productData) {
            $product = Product::find($productData['id']);
            if ($product->quantity < $productData['quantity']) {
                Log::warning('Not enough stock for product', ['product_id' => $product->id, 'requested_quantity' => $productData['quantity'], 'available_quantity' => $product->quantity]);

                return Inertia::render('CheckOut', [
                    'error' => 'Not enough stock for product: ' . $product->name,
                ])->toResponse($request);
            }
        }

        // Log before creating the order
        Log::info('Creating order for user', ['user_id' => $request->user_id, 'total' => $request->total]);

        // Create the order
        $order = Order::create([
            'user_id' => $request->user_id,
            'total' => $request->total,
            'status' => 'pending',
            'is_seen' => false,
        ]);

        // Attach products to the order and update quantities
        foreach ($products as $productData) {
            $product = Product::find($productData['id']);
            $order->products()->attach($productData['id'], ['quantity' => $productData['quantity']]);

            // Update the product's available quantity
            $product->quantity -= $productData['quantity'];
            $product->save();

            // Log after updating the product quantity
            Log::info('Updated product quantity', ['product_id' => $product->id, 'new_quantity' => $product->quantity]);
        }

        // Log after successfully creating the order
        Log::info('Order created successfully', ['order_id' => $order->id]);

        return Inertia::render('CheckOut', [
            'success' => 'Order has been submited. Wait for a call from our staff',
            'order' => $order,
        ])->toResponse($request);
    }

    // Display the specified order
    public function show(Order $order)
    {
        $order->load('products');
        return Inertia::render('Orders/Show', ['order' => $order]);
    }

    // Show the form for editing the specified order
    public function edit(Order $order)
    {
        $order->load('products');
        $products = Product::all();
        return Inertia::render('Orders/Edit', ['order' => $order, 'products' => $products]);
    }

    // Update the specified order in storage
    public function update(Request $request, Order $order)
    {
        // Log the incoming request data
        Log::info('Order update request received', $request->all());
    
        // Validate the incoming request data
        $request->validate([
            'total' => 'nullable|numeric',
            'is_seen' => 'nullable|boolean',
            'status' => 'nullable|string|in:pending,delivered',
            'products' => 'nullable|array',
            'products.*.id' => 'nullable|exists:products,id',
            'products.*.quantity' => 'nullable|integer|min:1',
        ]);
    
        // Update the order details
        $orderData = $request->only(['total', 'is_seen', 'status']);
        $order->update($orderData);
    
        // Log the updated order data
        Log::info('Order updated with new data', $orderData);
    
        if ($request->has('products')) {
            $products = $request->products;
    
            // Log the products to be updated
            Log::info('Products in update request', $products);
    
            // Check if requested quantities are available
            foreach ($products as $productData) {
                $product = Product::find($productData['id']);
                if ($product->quantity < $productData['quantity']) {
                    Log::warning('Not enough stock for product', ['product_id' => $product->id, 'requested_quantity' => $productData['quantity'], 'available_quantity' => $product->quantity]);
    
                    return Inertia::render('OrderEdit', [
                        'message' => 'Not enough stock for product: ' . $product->name,
                        'order' => $order->load('products'),
                    ]);
                }
            }
    
            // Detach existing products
            $order->products()->detach();
            Log::info('Existing products detached from order', ['order_id' => $order->id]);
    
            // Attach products to the order and update quantities
            foreach ($products as $productData) {
                $product = Product::find($productData['id']);
                $order->products()->attach($productData['id'], ['quantity' => $productData['quantity']]);
    
                // Update the product's available quantity
                $product->quantity -= $productData['quantity'];
                $product->save();
    
                // Log after updating the product quantity
                Log::info('Updated product quantity', ['product_id' => $product->id, 'new_quantity' => $product->quantity]);
            }
        }
    
        // Log the final order data
        Log::info('Order update successfully completed', ['order_id' => $order->id, 'order_data' => $order]);
    
        return Inertia::share([
            'message' => 'Order updated successfully',
            'isSeen' => $order->is_seen, // Share the updated is_seen value
        ]);
    }

    // Remove the specified order from storage
    public function destroy(Order $order)
    {
        // Detach products from the order
        $order->products()->detach();

        // Delete the order
        $order->delete();

        return response()->json(['message' => 'Order deleted successfully'], 200);
    }

    public function getChartData()
    {
        // Fetch most sold products
        $mostSoldProducts = Product::select('products.*')
            ->join('order_product', 'products.id', '=', 'order_product.product_id')
            ->selectRaw('products.id, products.name, SUM(order_product.quantity) as total_quantity')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_quantity')
            ->get();
        
        // Debug query
        Log::info('Most Sold Products Query:', ['query' => DB::getQueryLog()]);
    
        // Fetch re-ordered products
        $reOrderedProducts = Product::select('products.*')
            ->join('order_product', 'products.id', '=', 'order_product.product_id')
            ->selectRaw('products.id, products.name, COUNT(DISTINCT order_product.order_id) as re_order_count')
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('re_order_count')
            ->get();
        
        // Debug query
        Log::info('Re-Ordered Products Query:', ['query' => DB::getQueryLog()]);
    
        // Fetch stock check data
        $stockCheckData = Product::orderBy('quantity', 'desc')->get();
        
        // Debug query
        Log::info('Stock Check Data Query:', ['query' => DB::getQueryLog()]);
    
        return Inertia::render('Dashboard', [
            'mostSoldProducts' => $mostSoldProducts,
            'reOrderedProducts' => $reOrderedProducts,
            'stockCheckData' => $stockCheckData,
        ]);
    }
}