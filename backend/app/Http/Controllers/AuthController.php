<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Unit;

class AuthController extends Controller
{
    public function unauthorized(){
        return response()->json(['error' => 'Não autorizado' ], 401);
    }

    public function register(Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(),[
            'name'              => 'required',
            'email'             => 'required|email|unique:users,email',
            'cpf'               => 'required|digits:11|unique:users,cpf',
            'password'          => 'required',
            'password_confirm'  => 'required|same:password'
        ]);

        if(!$validator->fails()){

            $name = $request->input('name');
            $email = $request->input('email');
            $cpf = $request->input('cpf');
            $password = $request->input('password');

            $hash = password_hash($password, PASSWORD_DEFAULT);

            $newUser = new User();
            $newUser->name = $name;
            $newUser->email = $email;
            $newUser->cpf = $cpf;
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

            $properties = Unit::select(['id', 'name'])
            ->where('id_owner', $user['id'])
            ->get();

            $arr['user']['properties'] = $properties;

        }else{
            $arr['error'] = $validator->errors()->first();

            return $arr;
        }


        return $arr;
    }

    public function login(Request $request){
        $arr = ['error' => ''];

        $validator = Validator::make($request->all(), [
            'email' => 'required',
            'password' => 'required'
        ]);

        if(!$validator->fails()){
            $email = $request->input('email');
            $password = $request->input('password');

            $token = auth()->attempt([
                'email' => $email,
                'password' => $password
            ]);

            //Verificação de nível de acesso:
            //    0 = Desativa,
            //    1 = Admin,
            //    2 = Usuário proprietário,
            //    3 = Usuário dependente
            // if ($token) {
            //     $currentUser = Auth::user();
            //     if ($currentUser->admin > 0)) {
            //         return "invalid_credential";
            //     }
            // }

            if(!$token){
                $arr['error'] = 'E-mail e/ou Senha estão errados.';
                return $arr;
            }

            $arr['token'] = $token;
            $user = auth()->user();
            $arr['user'] = $user;

            $properties = Unit::select(['id', 'name'])
            ->where('id_owner', $user['id'])
            ->get();

            $arr['user']['properties'] = $properties;
        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function validateToken(Request $request){
        $arr = ['error' => ''];

        $user = auth()->user();
        $arr['user'] = $user;

        $properties = Unit::select(['id', 'name'])
        ->where('id_owner', $user['id'])
        ->get();

        $arr['user']['properties'] = $properties;

        return $arr;
    }

    public function logout(Request $request){
        $arr = ['error' => ''];

        $user = auth()->logout();

        return $arr;
    }
}
