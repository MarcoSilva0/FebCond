<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

use App\Models\Doc;

class DocController extends Controller
{
    public function getAll(){
        $arr = ['error' => ''];

        $docs = Doc::all();

        foreach($docs as $docKey => $docValue){
            $docs[$docKey]['fileurl'] = asset('storage/'.$docValue['fileurl']);
        }

        $arr['list'] = $docs;

        return $arr;
    }

    public function addDocs(Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'file' => 'required|file|mimes:pdf',
        ]);

        if(!$validator->fails()){

            $title = $request->input('title');
            $file = $request->file('file')->store('public');
            $file = explode('public/', $file);
            $fileurl = $file[1];

            $newDoc = new Doc();
            $newDoc->title = $title;
            $newDoc->fileurl = $fileurl;
            $newDoc->save();

        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function updateDocs($id, Request $request){
        $arr = ['error' => ''];


        $title = $request->input('title');
        $file = ($request->input('file')) ? $request->input('file') : $request->file('file');

        if($title){

            $item = Doc::find($id);

            if($item){
                $item->title = $title;
                if(is_object($file)){

                        $file = $request->file('file')->store('public');
                        $file = explode('public/', $file);
                        $fileurl = $file[1];
                        $item->fileurl = $fileurl;

                }
                $item->save();
            }else{
                $arr['error'] = 'Documento inexistente';
                return $arr;
            }

        }else{
            $arr['error'] = 'Título necessário';
            return $arr;
        }

        return $arr;
    }

    public function deleteDoc($id){
        $arr = ['error'=>''];

        $user = auth()->user();
        $aviso = Doc::find($id);

        if($aviso){

            Doc::find($id)->delete();

        }else{
            $arr['error'] = 'Documento inexistente';
            return $arr;
        }

        return $arr;
    }
}
