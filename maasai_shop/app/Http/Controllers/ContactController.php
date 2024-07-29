<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Subscription;
use Illuminate\Support\Facades\Log;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'message' => 'required|string',
        ]);

        Log::info('Contact form submitted', $request->all());

        Contact::create($request->all());

        return redirect()->back()->with('success', 'Thank you for your message!');
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'subscribeEmail' => 'required|email|max:255|unique:subscriptions,email',
        ]);

        Log::info('New subscription', $request->all());

        Subscription::create(['email' => $request->subscribeEmail]);

        return redirect()->back()->with('success', 'You have successfully subscribed!');
    }

    public function index()
    {
        return Inertia::render('Contacts', [
            'contacts' => Contact::all(),
        ]);
    }

    public function toggleSeen(Contact $contact)
    {
        $contact->is_seen = !$contact->is_seen;
        $contact->save();

        // Instead of returning a JSON response, use back to avoid rendering the full page
        return back()->with(['success' => true, 'is_seen' => $contact->is_seen]);
    }
}