<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Unit;
use App\Models\User;
use App\Models\UnitPeople;
use App\Models\UnitVehicle;
use App\Models\UnitPet;

class UnitController extends Controller
{
    public function getUnits(){

        $arr = ['error' => '', 'list' => []];

        $unidades = Unit::all();

        foreach($unidades as $unidadesKey => $unidadesValue){
            $unidades[$unidadesKey]['id'] = $unidadesValue['id'];
            $unidades[$unidadesKey]['name'] = $unidadesValue['name'];
            $unidades[$unidadesKey]['id_owner'] = $unidadesValue['id_owner'];

            $user = User::find($unidadesValue['id_owner']);
            if($user){
                $unidades[$unidadesKey]['name_owner'] = $user->name;
            }else{
                $unidades[$unidadesKey]['name_owner'] = '-';
            }


        }

        $arr['list'] = $unidades;

        return $arr;
    }

    public function addUnits(Request $request){
        $arr = ['error' => '', 'list' => []];

        $validator = Validator::make($request->all(),[
            'name'              => 'required',
            'id_owner'             => 'required'
        ]);

        if(!$validator->fails()){

            $name = $request->input('name');
            $id_owner = $request->input('id_owner');

            $newUnit = new Unit();
            $newUnit->name = $name;
            $newUnit->id_owner = $id_owner;
            $newUnit->save();

        }else{
            $arr['error'] = $validator->errors()->first();

            return $arr;
        }

        return $arr;
    }

    public function updateUnits($id, Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(),[
            'name'             => 'required',
            'id_owner'         => 'required'
        ]);

        if(!$validator->fails()){

            $name = $request->input('name');
            $id_owner = $request->input('id_owner');

            $item = Unit::find($id);

            if($item){

                $item->name = $name;
                $item->id_owner = $id_owner;
                $item->save();

            }else{
                $arr['error'] = 'Unidade inexistente';
                return $arr;
            }

        }else{
            $arr['error'] = $validator->errors()->first();

            return $arr;
        }

        return $arr;
    }

    public function deleteUnit($id){
        $arr = ['error'=>''];

        $user = auth()->user();
        $unidade = Unit::find($id);

        if($unidade){

            Unit::find($id)->delete();

        }else{
            $arr['error'] = 'Unidade inexistente';
            return $arr;
        }

        return $arr;
    }

    public function getInfo($id){
        $arr = ['error' => ''];

        $unit = Unit::find($id);

        if($unit){

            $peoples = UnitPeople::where('id_unit', $id)->get();
            $vehicles = UnitVehicle::where('id_unit', $id)->get();
            $pets = UnitPet::where('id_unit', $id)->get();

            foreach($peoples as $key => $value){
                $peoples[$key]['birthdate'] = date('d/m/Y', strtotime($value['birthdate']));
            }

            $arr['peoples'] = $peoples;
            $arr['vehicles'] = $vehicles;
            $arr['pets'] = $pets;

        }else{
            $arr['error'] = 'Propriedade inexistente';
            return $arr;
        }

        return $arr;
    }

    public function addperson($id, Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'birthdate' => 'required|date'
        ]);

        if(!$validator->fails()){
            $name = $request->input('name');
            $birthdate = $request->input('birthdate');

            $newPerson = new UnitPeople();
            $newPerson->id_unit = $id;
            $newPerson->name = $name;
            $newPerson->birthdate = $birthdate;
            $newPerson->save();
        }else{
            $arr['error'] = $validator->errors()->firt();
            return $arr;
        }

        return $arr;
    }

    public function addVehicle($id, Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'color' => 'required',
            'plate' => 'required'
        ]);

        if(!$validator->fails()){
            $title = $request->input('title');
            $color = $request->input('color');
            $plate = $request->input('plate');

            $newVehicle = new UnitVehicle();
            $newVehicle->id_unit = $id;
            $newVehicle->title = $title;
            $newVehicle->color = $color;
            $newVehicle->plate = $plate;
            $newVehicle->save();
        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function addPet($id, Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'race' => 'required'
        ]);

        if(!$validator->fails()){
            $name = $request->input('name');
            $race = $request->input('race');

            $newPet = new UnitPet();
            $newPet->id_unit = $id;
            $newPet->name = $name;
            $newPet->race = $race;
            $newPet->save();
        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function removePerson($id, Request $request){
        $arr = ['error' => ''];

        $idItem = $request->input('id');
        if($idItem){
            UnitPeople::where('id', $idItem)
            ->where('id_unit', $id)
            ->delete();
        }else{
            $arr['error'] = 'Id inexistente';
            return $arr;
        }

        return $arr;
    }

    public function removeVehicle($id, Request $request){
        $arr = ['error' => ''];

        $idItem = $request->input('id');
        if($idItem){
            UnitVehicle::where('id', $idItem)
            ->where('id_unit', $id)
            ->delete();
        }else{
            $arr['error'] = 'Id inexistente';
            return $arr;
        }

        return $arr;
    }
    public function removePet($id, Request $request){
        $arr = ['error' => ''];

        $idItem = $request->input('id');
        if($idItem){
            UnitPet::where('id', $idItem)
            ->where('id_unit', $id)
            ->delete();
        }else{
            $arr['error'] = 'Id inexistente';
            return $arr;
        }

        return $arr;
    }
}
