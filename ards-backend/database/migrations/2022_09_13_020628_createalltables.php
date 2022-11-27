<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class Createalltables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function(Blueprint $table){
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('cpf')->unique();
            $table->string('photo');
            $table->integer('permission');
            $table->string('password');
        });

        DB::table('users')->insert(
            array(
                'name' => 'Admin',
                'email' => 'admin@admin.com',
                'cpf' => '12345678910',
                'photo' => '',
                'permission' => 1,
                'password' => password_hash('123456a', PASSWORD_DEFAULT)
            )
        );

        Schema::create('units', function(Blueprint $table){
            $table->id();
            $table->string('name'); //AP 303, L5
            $table->integer('id_owner');
        });

        Schema::create('unit_peoples', function(Blueprint $table){
            $table->id();
            $table->integer('id_unit');
            $table->string('name');
            $table->date('birthdate');
        });

        Schema::create('unit_vehicles', function(Blueprint $table){
            $table->id();
            $table->integer('id_unit');
            $table->string('title');
            $table->string('color');
            $table->string('plate');
        });

        Schema::create('unit_pets', function(Blueprint $table){
            $table->id();
            $table->integer('id_unit');
            $table->string('name');
            $table->string('race');
        });

        Schema::create('walls', function(Blueprint $table){
            $table->id();
            $table->string('title');
            $table->string('body');
            $table->datetime('datecreated');
        });

        Schema::create('walllikes', function(Blueprint $table){
            $table->id();
            $table->integer('id_wall');
            $table->integer('id_user');
        });

        Schema::create('docs', function(Blueprint $table){
            $table->id();
            $table->string('title');
            $table->string('fileurl');
        });

        Schema::create('billets', function(Blueprint $table){
            $table->id();
            $table->integer('id_units');
            $table->string('title');
            $table->string('fileurl');
        });

        Schema::create('warnings', function(Blueprint $table){
            $table->id();
            $table->integer('id_units');
            $table->string('title');
            $table->string('status')->default('IN_REVIEW'); //IN_REVIEW, RESOLVED;
            $table->date('datecreated');
            $table->text('photos');
        });

        Schema::create('foundandlost', function(Blueprint $table){
            $table->id();
            $table->string('status')->default('LOST'); //LOST, RECOVERED
            $table->string('photo');
            $table->string('description');
            $table->string('where');
            $table->date('datecreated');
        });

        Schema::create('areas', function(Blueprint $table){
            $table->id();
            $table->integer('allowed')->default(1);
            $table->string('title');
            $table->string('cover');
            $table->string('days'); //0,1,2,3,4,5,6 == Domingo a Domingo
            $table->time('start_time');
            $table->time('end_time');
        });

        Schema::create('areasdisableddays', function(Blueprint $table){
            $table->id();
            $table->integer('id_area');
            $table->date('day');
        });

        Schema::create('reservations', function(Blueprint $table){
            $table->id();
            $table->integer('id_unit');
            $table->integer('id_area');
            $table->datetime('reservation_date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('units');
        Schema::dropIfExists('unit_peoples');
        Schema::dropIfExists('unit_vehicles');
        Schema::dropIfExists('unit_pets');
        Schema::dropIfExists('walls');
        Schema::dropIfExists('walllikes');
        Schema::dropIfExists('billets');
        Schema::dropIfExists('warnings');
        Schema::dropIfExists('foundandlost');
        Schema::dropIfExists('areas');
        Schema::dropIfExists('areasdisableddays');
        Schema::dropIfExists('reservations');
    }
}
