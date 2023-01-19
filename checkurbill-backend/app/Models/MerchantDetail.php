<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class MerchantDetail extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];

    public function merchant(): BelongsTo {
        return $this->belongsTo(Merchant::class);
    }

    public function institution(): HasOne {
        return $this->hasOne(InstitutionType::class);
    }

    public function category(): HasOne {
        return $this->hasOne(MerchantCategory::class);
    }

    public function type(): HasOne {
        return $this->hasOne(MerchantType::class);
    }

}
