<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use Illuminate\Http\Request;

use App\Models\Area as AreasComuns;

class Area extends Controller
{
    public function getAreas(){

        $arr = ['error' => '', 'list' => []];

        $areas = AreasComuns::all();

        foreach($areas as $areaKey => $areaValue){
            $areas[$areaKey]['cover'] = asset('storage/'.$areaValue['cover']);
        }

        $arr['list'] = $areas;

        return $arr;
    }

    public function addArea(Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'allowed' => 'required',
            'title' => 'required',
            'cover' => 'required|file|mimes:jpg,png',
            'days' => 'required',
            'start_time' => 'required',
            'end_time' => 'required',
        ]);



        if(!$validator->fails()){

            $allowed = $request->input('allowed');
            $title = $request->input('title');
            $days = $request->input('days');
            $start_time = $request->input('start_time');
            $end_time = $request->input('end_time');

            $file = $request->file('cover')->store('public');
            $file = explode('public/', $file);
            $fileurl = $file[1];

            $newArea = new AreasComuns();
            $newArea->allowed = $allowed;
            $newArea->title = $title;
            $newArea->cover = $fileurl;
            $newArea->days = $days;
            $newArea->start_time = $start_time;
            $newArea->end_time = $end_time;
            $newArea->save();

        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function updateAreaAllowed($id){
        $arr = ['error' => ''];

        //Usuário logado
        $user = auth()->user();
        $area = AreasComuns::find($id);

        if($area){

            if($area->allowed === 0){
                $area->allowed = 1;
                $area->save();
            }else{
                $area->allowed = 0;
                $area->save();
            }

        }else{
            $arr['error'] = 'Área inexistente';
            return $arr;
        }

        return $arr;
    }

    public function updateArea($id, Request $request){
        $arr = ['error' => ''];

        $area = AreasComuns::find($id);

            if($area){
                $validator = Validator::make($request->all(), [
                    'allowed' => 'required',
                    'title' => 'required',
                    'cover' => 'file|mimes:jpg,png',
                    'days' => 'required',
                    'start_time' => 'required',
                    'end_time' => 'required',
                ]);


                if(!$validator->fails()){

                    $allowed = $request->input('allowed');
                    $title = $request->input('title');
                    $days = $request->input('days');
                    $start_time = $request->input('start_time');
                    $end_time = $request->input('end_time');
                    $file = ($request->input('cover')) ? $request->input('cover') : $request->file('cover');

                    $area->allowed = $allowed;
                    $area->title = $title;
                    $area->days = $days;
                    $area->start_time = $start_time;
                    $area->end_time = $end_time;
                    if(is_object($file)){

                        $file = $request->file('cover')->store('public');
                        $file = explode('public/', $file);
                        $fileurl = $file[1];
                        $area->cover = $fileurl;

                    }
                    $area->save();

                }else{
                    $arr['error'] = $validator->errors()->first();
                    return $arr;
                }
            }else{
                $arr['error'] = 'Área inexistente';
                return $arr;
            }

        return $arr;
    }

    public function deleteArea($id){
        $arr = ['error'=>''];

        $user = auth()->user();
        $area = AreasComuns::find($id);

        if($area){

            AreasComuns::find($id)->delete();

        }else{
            $arr['error'] = 'Área inexistente';
            return $arr;
        }

        return $arr;
    }
}
