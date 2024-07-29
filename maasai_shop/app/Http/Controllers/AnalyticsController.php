<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\User;

class AnalyticsController extends Controller
{
    public function index()
    {
        $today = Carbon::today();
    
        $newUsers = User::whereDate('created_at', $today)->count();
        $returningUsers = User::whereDate('created_at', '<', $today)->count();
    
        return Inertia::render('Dashboard', [
            'newUsers' => $newUsers,
            'returningUsers' => $returningUsers,
        ]);
    }
}