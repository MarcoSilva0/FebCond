<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use App\Models\FoundAndLost;

class FoundAndLostController extends Controller
{
    public function getAll(){
        $arr = ['error' => ''];

        $lost = FoundAndLost::where('status', 'LOST')
        ->orderBy('datecreated', 'DESC')
        ->orderBy('id', 'DESC')
        ->get();

        $recovered = FoundAndLost::where('status', 'RECOVERED')
        ->orderBy('datecreated', 'DESC')
        ->orderBy('id', 'DESC')
        ->get();

        foreach($lost as $key => $value){
            $lost[$key]['datacreated'] = date('d/m/Y', strtotime($value['datecreated']));
            $lost[$key]['photo'] = asset('storage/'.$value['photo']);
        }

        foreach($recovered as $key => $value){
            $recovered[$key]['datacreated'] = date('d/m/Y', strtotime($value['datecreated']));
            $recovered[$key]['photo'] = asset('storage/'.$value['photo']);
        }

        $arr['lost'] = $lost;
        $arr['recovered'] = $recovered;

        return $arr;
    }

    public function insert(Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'description' => 'required',
            'where' => 'required',
            'photo' => 'required|file|mimes:jpg,png',
        ]);

        if(!$validator->fails()){

            $description = $request->input('description');
            $where = $request->input('where');
            $file = $request->file('photo')->store('public');
            $file = explode('public/', $file);
            $photo = $file[1];

            $newLost = new FoundAndLost();
            $newLost->status = 'LOST';
            $newLost->photo = $photo;
            $newLost->description = $description;
            $newLost->where = $where;
            $newLost->datecreated = date('Y-m-d H:i:s');
            $newLost->save();

        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function update($id, Request $request){
        $arr = ['error' => ''];

        $status = $request->input('status');
        if($status && in_array($status, ['LOST', 'RECOVERED'])){

            $item = FoundAndLost::find($id);
            if($item){
                $item->status = $status;
                $item->save();
            }else{
                $arr['error'] = 'Objeto inexistente';
                return $arr;
            }

        }else{
            $arr['error'] = 'Status não existe';
            return $arr;
        }

        return $arr;
    }
}
