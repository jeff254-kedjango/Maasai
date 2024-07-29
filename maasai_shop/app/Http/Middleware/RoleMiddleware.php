<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class RoleMiddleware
{
    public function handle($request, Closure $next, $role, $permission = null)
    {
        if (!Auth::check()) {
            return redirect('/login');
        }

        $user = Auth::user();

        if (!$user->hasRole($role)) {
            abort(403, 'Unauthorized');
        }

        if ($permission && !$user->can($permission)) {
            abort(403, 'Unauthorized');
        }

        return $next($request);
    }
}