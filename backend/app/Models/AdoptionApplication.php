<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AdoptionApplication extends Model
{
    protected $guarded = ['id'];

    public function pet(): BelongsTo
    {
        return $this->belongsTo(Pet::class);
    }
}
