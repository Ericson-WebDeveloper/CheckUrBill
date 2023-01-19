<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class MerchantType extends Model
{
    use HasFactory;

    protected $guarded = [];

    public function merchantdetail(): BelongsToMany {
        return $this->belongsToMany(MerchantDetail::class);
    }

}
