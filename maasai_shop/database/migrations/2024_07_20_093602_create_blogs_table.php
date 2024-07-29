<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBlogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('blogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('image')->nullable();
            $table->text('paragraph1')->nullable();
            $table->text('paragraph2')->nullable();
            $table->text('paragraph3')->nullable();
            $table->text('paragraph4')->nullable();
            $table->text('paragraph5')->nullable();
            $table->text('paragraph6')->nullable();
            $table->text('paragraph7')->nullable();
            $table->text('paragraph8')->nullable();
            $table->text('paragraph9')->nullable();
            $table->text('paragraph10')->nullable();
            $table->integer('total_views')->default(0);
            $table->string('editor');
            $table->string('category')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('blogs');
    }
}
