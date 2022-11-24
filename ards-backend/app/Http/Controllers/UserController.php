<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;

class UserController extends Controller
{
    public function getUsers(){

        $arr = ['error' => '', 'list' => []];

        $usuarios = User::all();

        $arr['list'] = $usuarios;

        return $arr;
    }
}
