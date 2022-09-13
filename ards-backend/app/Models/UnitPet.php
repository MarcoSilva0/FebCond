<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitPet extends Model
{
    use HasFactory;
    protected $hidden = [
        'id_unit'
    ];

    public $timestamps = false;
    public $table = 'unit_pets';
}
