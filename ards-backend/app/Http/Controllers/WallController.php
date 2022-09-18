<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Wall;
use App\Models\WallLike;

class WallController extends Controller
{
    public function getAll(){
        $arr = ['error' => '', 'list' => []];

        //Usuário logado
        $user = auth()->user();

        $walls = Wall::all();

        foreach($walls as $wallkey => $wallValue){
            $walls[$wallkey]['likes'] = 0;
            $walls[$wallkey]['liked'] = false;

            $likes = WallLike::where('id_wall', $wallValue['id'])->count();
            $walls[$wallkey]['likes'] = $likes;

            $melikes = WallLike::where('id_wall', $wallValue['id'])
            ->where('id_user', $user['id'])
            ->count();

            if($melikes > 0){
                $walls[$wallkey]['liked'] = true;
            }
        }

        $arr['list'] = $walls;

        return $arr;
    }

    public function like($id){
        $arr = ['error' => ''];

        //Usuário logado
        $user = auth()->user();

        $melikes = WallLike::where('id_wall', $id)
        ->where('id_user', $user['id'])
        ->count();

        if($melikes > 0){
            // Remove like
            WallLike::where('id_wall', $id)
            ->where('id_user', $user['id'])
            ->delete();

            $arr['liked'] = false;
        }else{
            // Adiciona like
            $newLike = new WallLike();
            $newLike->id_wall = $id;
            $newLike->id_user = $user['id'];
            $newLike->save();

            $arr['liked'] = true;
        }

        $arr['likes'] = WallLike::where('id_wall', $id)->count();

        return $arr;
    }
}
