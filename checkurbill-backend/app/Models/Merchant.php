<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Merchant extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    
    public function detail(): HasOne {
        return $this->hasOne(MerchantDetail::class);
    }

    protected function merchantCode(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => base64_encode($value),
            // set: fn ($value) => strtolower($value),
        );
    }

    // public function users(): HasMany
    // {
    //     return $this->hasMany(UserInfo::class, 'merchant_ref', 'merchant_ref');
    // }
    
}
