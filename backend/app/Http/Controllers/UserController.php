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

    public function updateUser($id, Request $request) {
        $arr = ['error' => ''];

        $name = $request->input('name');
        $email = $request->input('email');
        $cpf = $request->input('cpf');
        $permission = $request->input('permission');
        $password = $request->input('password');
        $photo = ($request->input('photo')) ? $request->input('photo') : $request->file('photo');

        if($name != '' && $cpf != '' && $email != '' && $password != '' ){

            $user = User::find($id);
            if($user){
                $user->name = $name;
                $user->email = $email;
                $user->cpf = $cpf;
                $user->permission = $permission;
                $user->password = password_hash($password, PASSWORD_DEFAULT);
                if(is_object($photo)){

                    $photo = $request->file('photo')->store('public');
                    $photo = explode('public/', $photo);
                    $photourl = $photo[1];
                    $user->photo = $photourl;

                }
                $user->save();
            }else{
                $arr['error'] = 'Usuário não existe';
                return $arr;
            }

        }else{
            $arr['error'] = 'Preencha os campos corretamente';
            return $arr;
        }

        return $arr;
    }
}
