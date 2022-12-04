# Sistema de Gestão de Condomínio

Sistema de gestão de Condomínio, desenvolvido em Laravel, ReactJS e React Native
## Funcionalidades

- Cadastro de Usuários
- Cadastro de Unidades( apartamentos, bloco ou casas)
- Cadastro de Ativos da Unidade (Moradores, Veículos, Pets)
- Mural de avisos
- Documentos
- Reserva das áreas comuns (Lista negra de datas)
- Acahados e Perdidos
- Livro de ocorrências
- Boletos

## Requisitos
- PHP
- Composer
- Mysql
- Node

### Pacotes
- JWT AUTH Laravel https://jwt-auth.readthedocs.io/en/develop/laravel-installation/
- CoreUI ReactJS template https://coreui.io/

## Configuração
- Clone o Repositório usando `git clone https://github.com/MarcoSilva0/FebCond.git`
- Crie um Schema/Base de dados mysql

### Back-end
1. Duplique o arquivo .env.example e renomeie para .env
2. Configure-o com nome do APP, URL que será executado e os dados do banco de dados
3. Dentro da pasta execute no terminal os seguinte comandos
3.1`composer install`
3.2`php artisan jwt:secret`
3.3`php artisan migrations`
3.4`php artisan storage:link`
3.5`php artisan serve`
> O último comando iniciará o servidor backend e terá como usuário padrão o admin@admin.com:123456a


### Front-end
1. Você pode configura qual a porta o sistema irá rodar dentro do arquivo .env, recomendamos que seja na porta 80
2. Dentro da pasta frontend execute no terminal os seguintes comandos
2.1 `npm install`
2.2 `npm start`

## Mobile
- Drawer
- ContextAPI / Async Storage
- Token - JWT
- FontAwesome (Icones)