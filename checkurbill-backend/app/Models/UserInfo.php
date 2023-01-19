<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\DB;

class UserInfo extends Model
{
    use HasFactory, HasUuids;

    protected $guarded = [];
    // protected $with = ['user'];

    public function user(): BelongsTo {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function merchant(): Merchant | null
    {
        // return $this->belongsTo(Merchant::class, 'merchant_ref', 'merchant_ref');
        $merchant = DB::table('merchants')->where('merchant_ref', '=', $this->merchant_ref)->first();
        return $merchant ? new Merchant((array)$merchant) : null;
    }

}
