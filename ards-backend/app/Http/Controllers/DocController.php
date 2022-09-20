<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

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
}
