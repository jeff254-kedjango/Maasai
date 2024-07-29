<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;


class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function showDetail($slug)
    {
        $user = Auth::user();
        // Load the product along with its category using the slug
        $product = Product::with('category')->where('slug', $slug)->firstOrFail();
        $categories = Category::orderBy('name')->get();
    
        // Get the category ID for the individual product
        $categoryId = $product->category_id;
    
        // Fetch other products in the same category excluding the individual product
        // and order them by updated_at in descending order
        $relatedProducts = Product::where('category_id', $categoryId)
            ->where('id', '!=', $product->id)
            ->orderBy('updated_at', 'desc')
            ->get();

    
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('ProductDetails', [
            'auth' => $authData,
            'product' => $product,
            'categories' => $categories,
            'relatedProducts' => $relatedProducts,
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        //
    }
}
