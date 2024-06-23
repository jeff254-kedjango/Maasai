<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

class Advert extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 
        'content', 
        'video', 
        'image', 
        'start_date', 
        'end_date',
    ];

    // Define the active scope
    public function scopeActive(Builder $query)
    {
        $now = Carbon::now();
        return $query->where('start_date', '<=', $now)
                     ->where('end_date', '>=', $now);
    }
}