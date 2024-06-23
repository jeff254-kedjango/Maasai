<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;

use Inertia\Inertia;

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
        $products = Product::all();
        return Inertia::render('Orders/Create', ['products' => $products]);
    }

    // Store a newly created order in storage
    public function store(Request $request)
    {
        // Validate the incoming request data
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total' => 'required|numeric',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $products = $request->products;

        // Check if requested quantities are available
        foreach ($products as $productData) {
            $product = Product::find($productData['id']);
            if ($product->quantity < $productData['quantity']) {
                return response()->json([
                    'message' => 'Not enough stock for product: ' . $product->name,
                ], 400);
            }
        }

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
        }

        return response()->json(['message' => 'Order created successfully', 'order' => $order], 201);
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
        // Validate the incoming request data
        $request->validate([
            'total' => 'required|numeric',
            'products' => 'required|array',
            'products.*.id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
        ]);

        $products = $request->products;

        // Check if requested quantities are available
        foreach ($products as $productData) {
            $product = Product::find($productData['id']);
            if ($product->quantity < $productData['quantity']) {
                return response()->json([
                    'message' => 'Not enough stock for product: ' . $product->name,
                ], 400);
            }
        }

        // Update the order
        $order->update([
            'total' => $request->total,
        ]);

        // Detach existing products
        $order->products()->detach();

        // Attach products to the order and update quantities
        foreach ($products as $productData) {
            $product = Product::find($productData['id']);
            $order->products()->attach($productData['id'], ['quantity' => $productData['quantity']]);

            // Update the product's available quantity
            $product->quantity -= $productData['quantity'];
            $product->save();
        }

        return response()->json(['message' => 'Order updated successfully', 'order' => $order], 200);
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
}