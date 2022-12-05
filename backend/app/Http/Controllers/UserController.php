<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

use App\Models\User;

class UserController extends Controller
{
    public function getUsers(){

        $arr = ['error' => '', 'list' => []];

        $usuarios = User::all();

        foreach($usuarios as $userKey => $userValue){
            if($usuarios[$userKey]['photo'] != ''){
                $usuarios[$userKey]['photo'] = asset('storage/'.$userValue['photo']);
            }else{
                $usuarios[$userKey]['photo'] = '';
            }
        }

        $arr['list'] = $usuarios;

        return $arr;
    }

    public function searchUsers(Request $request){
        $arr = ['error' => '', 'list' => []];

        $query = $request->input('q');

        $usuarios = DB::table('users')
            ->where('name', 'like', '%' . $query . '%')
            ->orWhere('email',  'like', '%' . $query . '%')
            ->orWhere('cpf',  'like', '%' . $query . '%')
            ->get();

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
                if($password != ''){
                    $user->password = password_hash($password, PASSWORD_DEFAULT);
                }
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

    public function addUser(Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(),[
            'name'              => 'required',
            'email'             => 'required|email|unique:users,email',
            'cpf'               => 'required|unique:users,cpf',
            'password'          => 'required',
            'password_confirm'  => 'required|same:password'
        ]);

        if(!$validator->fails()){

            $name = $request->input('name');
            $email = $request->input('email');
            $cpf = $request->input('cpf');
            $password = $request->input('password');
            $permission = $request->input('permission');
            $file = ($request->input('photo')) ? $request->input('photo') : $request->file('photo');

            $hash = password_hash($password, PASSWORD_DEFAULT);

            $newUser = new User();
            $newUser->name = $name;
            $newUser->email = $email;
            $newUser->cpf = $cpf;
            $newUser->permission = $permission;
            if(is_object($file)){

                $file = $request->file('photo')->store('public');
                $file = explode('public/', $file);
                $fileurl = $file[1];
                $newUser->photo = $fileurl;

            }
            $newUser->password = $hash;
            $newUser->save();

            $token = auth()->attempt([
                'cpf' => $cpf,
                'password' => $password
            ]);

            if(!$token){
                $arr['error'] = 'Ocorreu um erro.';
                return $arr;
            }

            $arr['token'] = $token;
            $user = auth()->user();
            $arr['user'] = $user;

        }else{
            $arr['error'] = $validator->errors()->first();

            return $arr;
        }


        return $arr;
    }

    public function deleteUser($id){
        $arr = ['error'=>''];

        $user = auth()->user();
        $usuario = User::find($id);

        if($usuario){

            User::find($id)->delete();

        }else{
            $arr['error'] = 'Usuário inexistente';
            return $arr;
        }

        return $arr;
    }
}
