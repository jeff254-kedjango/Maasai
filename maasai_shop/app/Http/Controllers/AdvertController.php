<?php

namespace App\Http\Controllers;

use App\Models\Advert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;



class AdvertController extends Controller
{
    public function index()
    {
        $adverts = Advert::all();
        return Inertia::render('Dashboard', [
            'adverts' => $adverts,
            'flash' => session('success')
        ]);
    }

    public function create()
    {
        return Inertia::render('CreateAdvert');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:20000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        // Log::info('Advert validated Data:', $validatedData);

        if ($request->hasFile('image')) {
            $validatedData['image'] = $request->file('image')->store('adverts', 'public');
        }

        if ($request->hasFile('video')) {
            $validatedData['video'] = $request->file('video')->store('adverts', 'public');
        }

        Advert::create($validatedData);

        return redirect()->route('admin.adverts.index')->with('success', 'Advert created successfully.');
    }

    public function edit(Advert $advert)
    {
        return Inertia::render('UpdateAdvert', [
            'advert' => $advert
        ]);
    }

    public function update(Request $request, Advert $advert)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:20000',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        // Handling Image Upload
        if ($request->hasFile('image')) {
            if ($advert->image) {
                Storage::disk('public')->delete($advert->image);
            }
            $validatedData['image'] = $request->file('image')->store('adverts', 'public');
        } else {
            // Retain the current image if no new image is uploaded
            $validatedData['image'] = $advert->image;
        }

        // Handling Video Upload
        if ($request->hasFile('video')) {
            if ($advert->video) {
                Storage::disk('public')->delete($advert->video);
            }
            $validatedData['video'] = $request->file('video')->store('adverts', 'public');
        } else {
            // Retain the current video if no new video is uploaded
            $validatedData['video'] = $advert->video;
        }

        // Update the Advert with validated data
        foreach ($validatedData as $key => $value) {
            $advert->$key = $value;
        }

        $updateSuccess = $advert->save();

        if ($updateSuccess) {
            return redirect()->route('admin.adverts.index')->with('success', 'Advert updated successfully.');
        } else {
            return redirect()->back()->with('error', 'Advert update failed.')->withInput();
        }
    }

    public function destroy(Advert $advert)
    {
        if ($advert->image) {
            Storage::disk('public')->delete($advert->image);
        }

        if ($advert->video) {
            Storage::disk('public')->delete($advert->video);
        }

        $advert->delete();

        return redirect()->route('admin.adverts.index')->with('success', 'Advert deleted successfully.');
    }
}