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

    public function getListReservation(){

        $arr = ['error' => '', 'list' => []];

        $reservas = Reservation::all();

        foreach($reservas as $reserva){
            $area = Area::find($reserva['id_area']);
            $unidade = Unit::find($reserva['id_unit']);
            $dataRes = date('d/m/Y H:i', strtotime($reserva['reservation_date']));
            $horaDepois = date('H:i', strtotime('+1 hour', strtotime($reserva['reservation_date'])));
            $dataRes .= ' à '. $horaDepois;

            $arr['list'][] = [
                'id' => $reserva['id'],
                'name_unit' => $unidade['name'],
                'id_unit' => $reserva['id_unit'],
                'name_area' => $area['title'],
                'id_area' => $reserva['id_area'],
                'reservation_date' => $dataRes
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

    public function getDisabledDates($id){
        $arr = ['error'=>''];

        $area = Area::find($id);
        if ($area) {

            //Dias desabilitados
            $diasDesabilitados = AreaDisabledDay::where('id_area', $id)->get();
            foreach($diasDesabilitados as $diaDesabilitado){
                $arr['list'][] = $diaDesabilitado['day'];
            }

            //Dias permitidos da area
            $diasDisponivel = explode(',', $area['days']);
            $offDias = [];
            for($i=0;$i<7;$i++){
                if(!in_array($i, $diasDisponivel)){
                    $offDias[] = $i;
                }
            }

            //Listar dias desabilitados +3meses para frente
            $inicio = time();
            $fim = strtotime('+3 months');
            $diaAtual = $inicio;
            $keep = true;

            for(
                $diaAtual = $inicio;
                $diaAtual < $fim;
                $diaAtual = strtotime('+1 day', $diaAtual)
            ){
                $ds = date('w', $diaAtual);
                if(in_array($ds, $offDias)){
                    $arr['list'][] = date('Y-m-d', $diaAtual);
                }
            }

        } else {
            $arr['error'] = 'Area inexistente';
            return $arr;
        }

        return $arr;
    }

    public function getTimes($id, Request $request){
        $arr = ['error'=>'','list'=>[]];

        $validator = Validator::make($request->all(), [
            'date' => 'required|date_format:Y-m-d'
        ]);

        if(!$validator->fails()){
            $date = $request->input('date');
            $area = Area::find($id);

            if($area){
                $can = true;

                //Verificar se o dia está desabilidato
                $existeDiaDesabilitado = AreaDisabledDay::where('id_area', $id)
                ->where('day', $date)
                ->count();
                if($existeDiaDesabilitado > 0){
                    $can = false;
                }

                //Verificar se o dia é permitido
                $diasDisponivel = explode(',', $area['days']);
                $diaSemana = date('w', strtotime($date));
                if(!in_array($diaSemana, $diasDisponivel)){
                    $can = false;
                }

                if($can){
                    $inicio = strtotime($area['start_time']);
                    $fim = strtotime($area['end_time']);
                    $horarios = [];

                    for(
                        $ultimoHorario = $inicio;
                        $ultimoHorario < $fim;
                        $ultimoHorario = strtotime('+1 hour', $ultimoHorario)
                    ){
                        $horarios[] = $ultimoHorario;
                    }

                    $listaHorarios = [];

                    foreach($horarios as $horario){
                        $listaHorarios[] = [
                            'id' => date('H:i:s', $horario),
                            'title' => date('H:i', $horario).' - '.date('H:i', strtotime('+1 hour', $horario)),
                        ];
                    }

                    //Removendo os horários com reserva
                    $reservas = Reservation::where('id_area', $id)
                    ->whereBetween('reservation_date', [
                        $date.' 00:00:00',
                        $date.' 23:59:59',
                    ])
                    ->get();

                    $toRemove = [];
                    foreach($reservas as $reserva){
                        $horario = date('H:i:s', strtotime($reserva['reservation_date']));
                        $toRemove[] = $horario;
                    }

                    foreach($listaHorarios as $value){
                        if(!in_array($value['id'], $toRemove)){
                            $arr['list'][] = $value;
                        }
                    }

                }

            }else{
                $arr['error'] = 'Área não encontrada!';
                return $arr;
            }
        }else{
            $arr['error'] = $validator->errors()->first();
            return $arr;
        }

        return $arr;
    }

    public function getMyReservation(Request $request){
        $arr = ['error'=>'', 'list' => []];

        $property = $request->input('property');
        if($property){
            $unidade = Unit::find($property);

            if($unidade){

                $reservas = Reservation::where('id_unit', $property)
                ->orderBy('reservation_date', 'DESC')
                ->get();

                foreach($reservas as $reserva){
                    $area = Area::find($reserva['id_area']);
                    $dataRes = date('d/m/Y H:i', strtotime($reserva['reservation_date']));
                    $horaDepois = date('H:i', strtotime('+1 hour', strtotime($reserva['reservation_date'])));
                    $dataRes .= ' à '. $horaDepois;

                    $arr['list'][] = [
                        'id' => $reserva['id'],
                        'id_area' => $reserva['id_area'],
                        'title' => $area['title'],
                        'cover' => asset('storage/'.$area['cover']),
                        'datereserved' => $dataRes
                    ];
                }

            }else{
                $arr['error'] = 'Propriedade inexistente';
                return $arr;
            }

        }else{
            $arr['error'] = 'É necessário informar a propriedade';
            return $arr;
        }

        return $arr;
    }

    public function delMyReservation($id){
        $arr = ['error'=>''];

        $user = auth()->user();
        $reserva = Reservation::find($id);

        if($reserva){

            $unidade = Unit::where('id', $reserva['id_unit'])
            ->where('id_owner', $user['id'])
            ->count();

            if($unidade > 0){
                Reservation::find($id)->delete();
            }else{
                $arr['error'] = 'Esta reservar não pertence ao seu usuário';
                return $arr;
            }

        }else{
            $arr['error'] = 'Reserva inexistente';
            return $arr;
        }

        return $arr;
    }
}
