<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;
use App\Models\User;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        Permission::create(['name' => 'edit products']);
        Permission::create(['name' => 'delete products']);
        Permission::create(['name' => 'view orders']);
        Permission::create(['name' => 'edit orders']);
        Permission::create(['name' => 'delete orders']);
        Permission::create(['name' => 'view user list']);
        Permission::create(['name' => 'assign roles']);

        // Create roles and assign existing permissions
        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(Permission::all());

        $role = Role::create(['name' => 'staff']);
        $role->givePermissionTo(['edit products', 'delete products', 'view orders', 'edit orders']);

        Role::create(['name' => 'customer']);

        // Assign roles to specific users
        $user = User::find(1);
        if ($user) {
            $user->assignRole('admin');
        }

        $user = User::find(2);
        if ($user) {
            $user->assignRole('staff');
        }

        $user = User::find(3);
        if ($user) {
            $user->assignRole('customer');
        }
    }
}