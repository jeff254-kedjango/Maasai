<?php

namespace App\Http\Controllers;

use App\Models\Advert;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;



class AdvertController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $adverts = Advert::all();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('Dashboard', [
            'adverts' => $adverts,
            'auth' => $authData,
            'flash' => session('success')
        ]);
    }

    public function create()
    {
        $user = Auth::user();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;
        return Inertia::render('CreateAdvert', [
            'auth' => $authData,
        ]);
    }


    public function store(Request $request)
    {
        Log::info('Advert store method called.', $request->all());

        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'video' => 'nullable|file|mimes:mp4,mov,ogg,qt|max:30000',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg,webp',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ]);

            Log::info('Advert validated Data:', $validatedData);

            if ($request->hasFile('image')) {
                $validatedData['image'] = $request->file('image')->store('adverts', 'public');
                Log::info('Advert image stored at:', ['path' => $validatedData['image']]);
            }

            if ($request->hasFile('video')) {
                $validatedData['video'] = $request->file('video')->store('adverts', 'public');
                Log::info('Advert video stored at:', ['path' => $validatedData['video']]);
            }

            Advert::create($validatedData);
            Log::info('Advert created successfully.', $validatedData);

            return redirect()->route('dashboard')->with('success', 'Advert created successfully.');
        } catch (ValidationException $e) {
            Log::error('Validation error:', $e->errors());
            return back()->withErrors($e->errors())->withInput();
        }
    }

    public function edit(Advert $advert)
    {
        $user = Auth::user();
        $authData = $user ? [
            'user' => $user,
            'roles' => $user->getRoleNames()->toArray(),
        ] : null;

        return Inertia::render('UpdateAdvert', [
            'advert' => $advert,
            'auth' => $authData,
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
            return redirect()->route('dashboard')->with('success', 'Advert updated successfully.');
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

        return redirect()->route('dashboard')->with('success', 'Advert deleted successfully.');
    }
}