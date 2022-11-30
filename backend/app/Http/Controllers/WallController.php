<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Wall;
use App\Models\WallLike;
use Illuminate\Support\Facades\Validator;

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

    public function updateWall($id, Request $request){
        $arr = ['error' => ''];

        $title = $request->input('title');
        $body = $request->input('body');
        if($title != '' && $body != '' ){

            $item = Wall::find($id);
            if($item){
                $item->title = $title;
                $item->body = $body;
                $item->save();
            }else{
                $arr['error'] = 'Aviso inexistente';
                return $arr;
            }

        }else{
            $arr['error'] = 'Aviso inexistente';
            return $arr;
        }

        return $arr;
    }

    public function addWall(Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'body' => 'required',
        ]);

        if(!$validator->fails()){

            $title = $request->input('title');
            $body = $request->input('body');

            $newWall = new Wall();
            $newWall->title = $title;
            $newWall->body = $body;
            $newWall->datecreated = date('Y-m-d');
            $newWall->save();
        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function deleteWall($id){
        $arr = ['error'=>''];

        $user = auth()->user();
        $aviso = Wall::find($id);

        if($aviso){

            Wall::find($id)->delete();

        }else{
            $arr['error'] = 'Aviso inexistente';
            return $arr;
        }

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
