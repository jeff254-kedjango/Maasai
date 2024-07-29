<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use Illuminate\Validation\ValidationException;

use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $categories = Category::orderBy('name', 'asc')->get();

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('CategoryList', [
            'categories' => $categories,
            'auth' => $authData,
        ]);
    }

    public function create()
    {
        $user = Auth::user();

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('CreateCategory', [
            'auth' => $authData,
        ]);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:20480',
        ]);

        try {
            // Create the category without the image first
            $category = Category::create([
                'name' => $validatedData['name'],
                'description' => $validatedData['description'] ?? null,
            ]);

            // Handle the file upload
            if ($request->hasFile('image')) {
                $imagePath = $request->file('image')->store('images', 'public');
                $category->image = $imagePath;
                $category->save();
            }

            session()->flash('success', 'Category created successfully.');
            return redirect()->route('dashboard');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['image' => 'The image failed to upload.']);
        }
    }

    public function show(Category $category)
    {
        $user = Auth::user();

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('Categories/Show', [
            'category' => $category,
            'auth' => $authData,
        ]);
    }

    public function edit(Category $category)
    {
        $user = Auth::user();

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('CategoryEdit', [
            'category' => $category,
            'auth' => $authData,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        try {
            // Log the initial request data
            Log::info('Update Category Request Data:', ['request_data' => $request->all()]);
    
            // Validate request data
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:20480',
            ]);
    
            // Log validation success
            Log::info('Validation successful.', ['validated_data' => $validatedData]);
    
            // Handle file upload
            if ($request->hasFile('image')) {
                // Log file upload process
                Log::info('Processing image upload.');
    
                // Delete the old image if it exists
                if ($category->image) {
                    Log::info('Deleting old image.', ['old_image' => $category->image]);
                    Storage::disk('public')->delete($category->image);
                }
    
                // Store the new image
                $validatedData['image'] = $request->file('image')->store('images', 'public');
                Log::info('New image uploaded.', ['new_image' => $validatedData['image']]);
            }
    
            // Update the category
            $category->update($validatedData);
            Log::info('Category updated successfully.', ['category' => $category]);
    
            // Flash a success message to the session
            session()->flash('success', 'Category updated successfully.');
            
        } catch (ValidationException $e) {
            // Handle validation exceptions
            Log::error('Validation failed.', ['errors' => $e->errors()]);
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            // Handle any other exceptions
            Log::error('Update category failed.', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'An unexpected error occurred.');
        }
    
        // Redirect to the category index page
        return redirect()->route('dashboard');
    }

    public function productShow(Category $category)
    {
        $user = Auth::user();

        // Retrieve products associated with the category, ordered by 'created_at' in descending order
        $products = $category->products()->orderBy('updated_at', 'desc')->get();

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('ProductCategory', [
            'category' => $category,
            'products' => $products,
            'auth' => $authData,
        ]);
    }

    public function destroy(Category $category)
    {
        $category->delete();
        session()->flash('success', 'Category deleted successfully.');
        return redirect()->route('dashboard');
    }
}