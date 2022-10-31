<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Area;
use App\Models\AreaDisabledDay;
use App\Models\Reservation;
use App\Models\Unit;

class ReservationController extends Controller
{
    public function getReservation(){
        $arr = ['error' => '', 'list' => []];
        $diasAuxiliares = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

        $areas = Area::where('allowed', 1)->get();

        foreach($areas as $area){
            $listaDias = explode(',', $area['days']);

            $grupoDeDias = [];
            //Adiciona o Primeiro Dia
            $ultimoDia = intval(current($listaDias));
            $grupoDeDias[] = $diasAuxiliares[$ultimoDia];
            array_shift($listaDias);

            //Adicionando dias relevantes
            foreach($listaDias as $dia){

                if(intval($dia) != $ultimoDia+1){
                    $grupoDeDias[] = $diasAuxiliares[$ultimoDia];
                    $grupoDeDias[] = $diasAuxiliares[$dia];
                }

                $ultimoDia = intval($dia);
            }

            //Adicionando o último dia
            $grupoDeDias[] = $diasAuxiliares[end($listaDias)];

            //Mesclando as datas
            $dias = '';
            $fechar = 0;
            foreach($grupoDeDias as $grupo){
                if($fechar === 0){
                    $dias .= $grupo;
                }else{
                    $dias .= '-' . $grupo . ',';
                }

                $fechar = 1 - $fechar;
            }

            $dias = explode(',', $dias);
            array_pop($dias);

            //Adicionando o Time
            $inicio = date('H:i', strtotime($area['start_time']));
            $fim = date('H:i', strtotime($area['end_time']));

            foreach($dias as $key => $value){
                $dias[$key] .= ' '.$inicio.' às '.$fim;
            }

            $arr['list'][] = [
                'id' => $area['id'],
                'cover' => asset('storage/'.$area['cover']),
                'title' => $area['title'],
                'dates' => $dias
            ];
        }

        return $arr;
    }

    public function setReservation($id, Request $request){
        $arr = ['error'=>''];

        $validator = Validator::make($request->all(), [
            'date' => 'required|date_format:Y-m-d',
            'time' => 'required|date_format:H:i:s',
            'property' => 'required'
        ]);
        if(!$validator->fails()){
            $date = $request->input('date');
            $time = $request->input('time');
            $property = $request->input('property');

            $unit = Unit::find($property);
            $area = Area::find($id);

            if($unit && $area){
                $can = true;
                $diaSemana = date('w', strtotime($date));

                //Verifica a disponibilidade padrão(Dia/Hora comercial)
                $diasDisponivel = explode(',', $area['days']);
                if(!in_array($diaSemana, $diasDisponivel)){
                    $can = false;
                }else{
                    $start = strtotime($area['start_time']);
                    $end = strtotime('-1 hour', strtotime($area['end_time']));
                    $revtime = strtotime($time);
                    if($revtime < $start || $revtime > $end){
                        $can = false;
                    }
                }

                //verfica se está fora do dias desabilitados
                $existeDiaDesabilitado = AreaDisabledDay::where('id_area', $id)
                ->where('day', $date)
                ->count();
                if($existeDiaDesabilitado > 0){
                    $can = false;
                }

                //verificar se já existe reservar para esse dia
                $existeReserva = Reservation::where('id_area', $id)
                ->where('reservation_date', $date.' '.$time)
                ->count();
                if($existeReserva > 0){
                    $can = false;
                }


                if($can){
                    $novaReserva = new Reservation();
                    $novaReserva->id_unit = $property;
                    $novaReserva->id_area = $id;
                    $novaReserva->reservation_date = $date.' '.$time;
                    $novaReserva->save();
                }else{
                    $arr['error'] = 'Reservar não permitida';
                }
            }else{
                $arr['error'] = 'Dados incorretos';
                return $arr;
            }

        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }
}
