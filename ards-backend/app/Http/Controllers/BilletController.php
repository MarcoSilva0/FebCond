<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

use App\Models\Billet;
use App\Models\Unit;

class BilletController extends Controller
{
    public function getAll(Request $request){
        $arr = ['error' => ''];

        $property = $request->input('property');

        if($property){
            $user = auth()->user();

            $unit = Unit::where('id', $property)
            ->where('id_owner', $user['id'])
            ->count();

            if($unit > 0){
                $billets = Billet::where('id_unit', $property)->get();

                foreach($billets as $billetKey => $billetValue){
                    $billets[$billetKey]['fileurl'] = asset('storage/'.$billetValue['fileurl']);
                }

                $arr['list'] = $billets;
            }else{
                $arr['error'] = 'Unidade não pertece ao usuário atual';
            }


        }else{
            $arr['error'] = 'É necessário informar a unidade';
        }
        return $arr;
    }
}
