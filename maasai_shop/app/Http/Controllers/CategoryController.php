<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::orderBy('name', 'asc')->get();
        return Inertia::render('CategoryList', ['categories' => $categories]);
    }

    public function create()
    {
        return Inertia::render('CreateCategory');
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
            return redirect()->route('categories.create');
        } catch (\Exception $e) {
            // Log the error message
            // \Log::error('File upload error: ' . $e->getMessage());
            
            return redirect()->back()->withErrors(['image' => 'The image failed to upload.']);
        }
    }

    public function show(Category $category)
    {
        return Inertia::render('Categories/Show', ['category' => $category]);
    }

    public function edit(Category $category)
    {
        return Inertia::render('CategoryEdit', ['category' => $category]);
    }


    public function update(Request $request, Category $category)
    {
        // dd($request);
        // Validate the incoming request
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp|max:20480',
        ]);
    
        // Handle the file upload
        if ($request->hasFile('image')) {
            // Delete the old image if it exists
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            // Store the new image
            $validatedData['image'] = $request->file('image')->store('images', 'public');
        }
    
        // Update the category
        $category->update($validatedData);
    
        // Flash a success message to the session
        session()->flash('success', 'Category updated successfully.');
    
        // Redirect to the category index page
        return redirect()->route('dashboard');
    }


    public function destroy(Category $category)
    {
        $category->delete();
        return redirect()->route('categories.index');
    }
}
