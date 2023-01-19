<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillCostumer extends Model
{
    use HasFactory;
    public $timestamps = true;
    protected $table = 'bill_costumers';
    protected $guarded = [];

}
