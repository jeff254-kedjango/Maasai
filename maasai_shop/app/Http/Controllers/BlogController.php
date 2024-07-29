<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Blog;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $blogs = Blog::orderBy('created_at', 'desc')->get();
        Log::info('Fetching all blogs');

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('Blog', [
            'blogs' => $blogs,
            'auth' => $authData,
        ]);
    }

    public function show($slug)
    {
        $user = Auth::user();
        $blog = Blog::with('editor')->where('slug', $slug)->firstOrFail();
        $offers = Product::whereNotNull('sale_price')->orderBy('updated_at', 'asc')->get();
        $newStock = Product::orderBy('updated_at', 'desc')->get();

        $blog->increment('total_views');

        // Log the increment
        Log::info('Blog view incremented', ['blog_id' => $slug, 'total_views' => $blog->total_views]);

        Log::info('Showing blog', ['slug' => $slug]);

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('BlogDetails', [
            'blog' => $blog,
            'offers' => $offers,
            'newStock' => $newStock,
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

        return Inertia::render('BlogCreate', [
            'auth' => $authData,
        ]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        // Log to see if method is hit
        Log::info('Store method called');

        // Log request data
        Log::info('Request data', $request->all());

        // Validate the incoming request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'nullable|string|max:255', // Adjust validation rule
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'paragraph1' => 'nullable|string',
            'paragraph2' => 'nullable|string',
            'paragraph3' => 'nullable|string',
            'paragraph4' => 'nullable|string',
            'paragraph5' => 'nullable|string',
            'paragraph6' => 'nullable|string',
            'paragraph7' => 'nullable|string',
            'paragraph8' => 'nullable|string',
            'paragraph9' => 'nullable|string',
            'paragraph10' => 'nullable|string',
        ]);

        // Set the editor field to the authenticated user's ID
        $validatedData['editor'] = $user->id;

        // Handle the image file if it exists
        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('images', 'public');
            Log::info('Image path', ['path' => $validatedData['image']]);
        }

        // Log validated data
        Log::info('Validated data', $validatedData);

        try {
            // Create the blog entry
            $blog = Blog::create($validatedData);
            Log::info('Blog created', ['blog' => $blog]);
        } catch (\Exception $e) {
            Log::error('Error creating blog', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Failed to create blog');
        }

        // Redirect to the blog index with a success message
        return redirect()->route('dashboard')->with('success', 'Blog created successfully!');
    }

    public function edit($slug)
    {
        $user = Auth::user();
        $blog = Blog::where('slug', $slug)->firstOrFail();
        Log::info('Editing blog', ['slug' => $slug]);

        // Prepare user-specific data
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('BlogEdit', [
            'blog' => $blog,
            'auth' => $authData,
        ]);
    }

    public function update(Request $request, $slug)
    {
        $user = Auth::user();
        // Retrieve the blog by slug
        $blog = Blog::where('slug', $slug)->firstOrFail();
        Log::info('Updating blog', ['slug' => $slug]);

        try {
            // Validate the incoming request data
            $validatedData = $request->validate([
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
                'title' => 'required|string|max:255',
                'paragraph1' => 'nullable|string',
                'paragraph2' => 'nullable|string',
                'paragraph3' => 'nullable|string',
                'paragraph4' => 'nullable|string',
                'paragraph5' => 'nullable|string',
                'paragraph6' => 'nullable|string',
                'paragraph7' => 'nullable|string',
                'paragraph8' => 'nullable|string',
                'paragraph9' => 'nullable|string',
                'paragraph10' => 'nullable|string',
                'total_views' => 'nullable|integer',
                'category' => 'nullable|string|max:255', // Adjusted validation rule
            ]);

            // Set the editor field to the authenticated user's ID
            $validatedData['editor'] = $user->id;

            // Log validated data
            Log::info('Validated data', $validatedData);
        } catch (\Exception $e) {
            Log::error('Validation error', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Validation failed');
        }

        // Handle the image file if it exists
        if ($request->hasFile('image')) {
            // Delete the old image
            Storage::disk('public')->delete($blog->image);

            // Store the new image
            $validatedData['image'] = $request->file('image')->store('images', 'public');
            Log::info('Image path', ['path' => $validatedData['image']]);
        }

        try {
            // Update the blog entry
            $blog->update($validatedData);
            Log::info('Blog updated', ['slug' => $blog->slug]);
        } catch (\Exception $e) {
            Log::error('Error updating blog', ['error' => $e->getMessage()]);
            return redirect()->back()->with('error', 'Failed to update blog');
        }

        // Redirect to the blog index with a success message
        return redirect()->route('dashboard')->with('success', 'Blog updated successfully.');
    }

    public function destroy($slug)
    {
        $user = Auth::user();
        $blog = Blog::where('slug', $slug)->firstOrFail();
        Storage::disk('public')->delete($blog->image);
        $blog->delete();
        Log::info('Blog deleted', ['slug' => $slug]);

        return redirect()->route('dashboard')->with('success', 'Blog deleted successfully.');
    }
}