<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bill extends Model
{
    use HasFactory;

    public $timestamps = true;
    protected $guarded = [];
    // protected $primaryKey = 'id';
    // public $incrementing = false;
    // public $table = 'bills';
    // protected $fillable = [
    //     'batch_no', 
    //     'merchant_id', 
    //     'path_file', 
    //     'status', 
    //     'bill_month', 
    //     'date_uploaded', 
    //     'date_approved', 
    //     'date_reject', 
    //     'remarks',
    //     'created_at',
    //     'updated_at'
    // ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    // protected $casts = [
    //     'id' => 'string'
    // ];

}
