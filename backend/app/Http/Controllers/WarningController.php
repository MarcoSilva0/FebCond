<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use App\Models\Warning;
use App\Models\Unit;

class WarningController extends Controller
{
    public function getWarnings(){

        $arr = ['error' => '', 'list' => []];

        $ocorrencias = Warning::all();

        foreach($ocorrencias as $ocorrencia){

            $unidade = Unit::find($ocorrencia['id_unit']);
            $dataOco = date('d/m/Y', strtotime($ocorrencia['datecreated']));

            $photos = explode(',', $ocorrencia['photos']);

            foreach($photos as $photo){
                if(!empty($photo)){
                    $photList[] = asset('storage/'.$photo);
                }
            }

            $arr['list'][] = [
                'id' => $ocorrencia['id'],
                'id_unit' => $ocorrencia['id_unit'],
                'title' => $ocorrencia['title'],
                'status' => $ocorrencia['status'],
                'datecreated' => $ocorrencia['datecreated'],
                'photos' => $photList,
                'name_unit' => $unidade['name'],
                'datecreated_formatted' => $dataOco
            ];
        }

        return $arr;
    }

    public function getMyWarnings(Request $resquest){
        $arr = ['error' => ''];

        $property = $resquest->input('property');

        if($property){

            $user = auth()->user();

            $unit = Unit::where('id', $property)
            ->where('id_owner', $user['id'])
            ->count();

            if($unit > 0){

                $warnings = Warning::where('id_unit', $property)
                ->orderBy('datecreated', 'DESC')
                ->orderBy('id', 'DESC')
                ->get();

                foreach($warnings as $warnKey => $warnValue){
                    $warnings[$warnKey]['datecreated'] = date('d/m/Y', strtotime($warnValue['datecreated']));
                    $photList = [];
                    $photos = explode(',', $warnValue['photos']);

                    foreach($photos as $photo){
                        if(!empty($photo)){
                            $photList[] = asset('storage/'.$photo);
                        }
                    }

                    $warnings[$warnKey]['photos'] = $photList;

                }

                $arr['list'] = $warnings;

            }else{
                $arr['error'] = 'Unidade não pertece ao usuário atual';
            }

        }else{
            $arr['error'] = 'A propriedade é necessário';
        }

        return $arr;
    }

    public function setWarning(Request $resquest){
        $arr = ['error' => ''];

        $validator = Validator::make($resquest->all(),[
            'title' => 'required',
            'property' => 'required'
        ]);

        if(!$validator->fails()){
            $title = $resquest->input('title');
            $property = $resquest->input('property');
            $list = $resquest->input('list');

            $newWarn = new Warning();
            $newWarn->id_unit = $property;
            $newWarn->title = $title;
            $newWarn->status = 'IN_REVIEW';
            $newWarn->datecreated = date('Y-m-d');

            if($list && is_array($list)){
                $photos = [];

                foreach($list as $listItem){
                    $url = explode('/', $listItem);
                    $photos[] = end($url);
                }

                $newWarn->photos = implode(',', $photos);
            }else{
                $newWarn->photos = '';
            }

            $newWarn->save();

        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function addWarningFile(Request $resquest){
        $arr = ['error' => ''];

        $validator = Validator::make($resquest->all(), [
            'photo' => 'required|file|mimes:jpg,png'
        ]);

        if(!$validator->fails()){
            $file = $resquest->file('photo')->store('public');

            $arr['photo'] = asset(Storage::url($file));

        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }
}
