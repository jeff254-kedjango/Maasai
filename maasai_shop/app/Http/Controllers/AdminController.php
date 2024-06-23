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

class AdminController extends Controller
{

    public function showCreateProductForm()
    {
        $categories = Category::orderBy('name')->get();
        return Inertia::render('CreateProducts', [
            'info' => 'This is the Shopping page.',
            'auth' => [
                'user' => Auth::user(),
            ],
            'categories' => $categories,
            'flash' => session('flash', ['success' => session('success')]), // Pass flash message
        ]);
    }

    public function dashboard()
    {
        $orders = Order::orderBy('created_at', 'desc')->get();
        $products = Product::orderBy('created_at', 'desc')->get();
        $categories = Category::orderBy('name')->get();
        $adverts = Advert::active()->orderBy('created_at', 'desc')->get();
    
        // Count new (unseen) orders
        $newOrders = Order::where('status', 'pending')->orderBy('created_at', 'desc')->count();
    
        return Inertia::render('Dashboard', [
            'info' => 'Welcome to your Admin Dashboard',
            'auth' => [
                'user' => Auth::user(),
            ],
            'orders' => $orders,
            'products' => $products,
            'adverts' => $adverts,
            'categories' => $categories,
            'newOrders' => $newOrders,
        ]);
    }

    public function createProduct(Request $request)
    {
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
            'video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:20000',
        ]);
    
        $product = Product::create($validated);
    
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
    
        return redirect()->route('admin.show-create-product-form');
    }

    public function editProduct($id)
    {
        $product = Product::findOrFail($id);
        $categories = Category::orderBy('name')->get();

        return Inertia::render('ProductEdit', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'product' => $product,
            'categories' => $categories,
        ]);
    }
    
    public function updateProduct(Request $request, Product $product)
    {
        //Log::info('Updating Product ID:', ['id' => $product->id]);
    
        // Validate the request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'sale_price' => 'nullable|numeric',
            'category_id' => 'required|exists:categories,id',
            'quantity' => 'required|numeric',
            'image1' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image2' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image3' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'image4' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:20000',
        ]);
    
        //Log::info('Validated Data:', $validatedData);
    
        // Ensure category_id is an integer
        $validatedData['category_id'] = (int) $validatedData['category_id'];
    
        // Handle image and video uploads
        foreach (['image1', 'image2', 'image3', 'image4', 'video'] as $fileField) {
            if ($request->hasFile($fileField)) {
                // Delete the existing file if it exists
                if ($product->{$fileField}) {
                    Storage::disk('public')->delete($product->{$fileField});
                }
                // Store the new file and update the validated data array
                $validatedData[$fileField] = $request->file($fileField)->store('images', 'public'); // Consistent directory
            } else {
                // If no new file is uploaded, remove the key from the validated data to prevent overwriting
                unset($validatedData[$fileField]);
            }
        }
    
        // Log data before update
        //Log::info('Data before update:', $product->toArray());
    
        // Update the product by setting individual fields and saving
        foreach ($validatedData as $key => $value) {
            $product->$key = $value;
        }
    
        $updateSuccess = $product->save();
    
        if ($updateSuccess) {
           // Log::info('Product Updated Successfully:', $product->toArray());
            session()->flash('success', 'Product updated successfully.');
            return redirect()->route('dashboard');
        } else {
            // Log::error('Product update failed.');
            session()->flash('error', 'Product update failed.');
            return redirect()->back()->withInput();
        }
    }
    

    public function deleteProduct($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
    
        session()->flash('success', 'Product deleted successfully.');
        return redirect()->route('dashboard');
    }


}