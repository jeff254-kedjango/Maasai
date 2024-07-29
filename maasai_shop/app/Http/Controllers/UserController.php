<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function toggleRole(Request $request, User $user)
    {
        $role = $request->input('role');

        if ($user->hasRole($role)) {
            $user->removeRole($role);
        } else {
            $user->assignRole($role);
        }

        return redirect()->back()->with('success', 'Role updated successfully.');
    }
}