<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Blog extends Model
{
    use HasFactory, HasSlug;

    protected $fillable = [
        'title',
        'category_id',
        'image',
        'paragraph1',
        'paragraph2',
        'paragraph3',
        'paragraph4',
        'paragraph5',
        'paragraph6',
        'paragraph7',
        'paragraph8',
        'paragraph9',
        'paragraph10',
        'editor',
        'total_views', // Add this field to fillable
    ];


    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    /**
     * Find the blog by slug instead of ID.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }

    // Define the relationship with the User model
    public function editor()
    {
        return $this->belongsTo(User::class, 'editor');
    }
    
}