<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id(); // This should be unsignedBigInteger by default
            $table->unsignedBigInteger('user_id');
            $table->decimal('total', 10, 2);
            $table->string('status')->default('pending');
            $table->boolean('is_seen')->default(false);
            $table->timestamps();
        
            // Add foreign key for user_id if it references a users table
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_product');
    }
};
