<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Area as AreasComuns;

class Area extends Controller
{
    public function getAreas(){

        $arr = ['error' => '', 'list' => []];

        $areas = AreasComuns::all();

        $arr['list'] = $areas;

        return $arr;
    }
}
