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

### Pacotes
- JWT AUTH Laravel https://jwt-auth.readthedocs.io/en/develop/laravel-installation/
- CoreUI ReactJS template https://coreui.io/

### Utilidade
- Para salvar os arquivos foi criado um storage no backend com a ferramenta storage do Laravel para criar foi utilizado o comando "php artisan storage:link"
- Ao instalar o Back-end rode no terminarl o seguinte comando dentro da pasta 'php composer install' 
- Ao instalar o Front-end rode no terminarl o seguinte comando dentro da pasta 'npm install' 

## Back-end
- Composer install
- Configurar o .env
- Gere clone o .env e configure as credenciais do banco de dados
- Para que o sistema funcione terá que gerar uma chave do JWT com 'php artisan jwt:secret' e add os seguintes items no .env
-- JWT_SECRET=chave_secreta_que_voce_gerou
- php artisan migrations
- php artisan storage:link
- Para iniciar o servidor basta roda 'php artisan serve'
- Login e senha do usuário padrão = admin@admin.com:123456a

## Front-end
- Para iniciar o servidor basta roda 'npm start'
- Para o dashboard foi utilziado a biblioteca CoreUI Admin no ReacJs, template adquirido no repositório: https://github.com/coreui/coreui-free-react-admin-template


## Mobile
- Drawer
- ContextAPI / Async Storage
- Token - JWT
- FontAwesome (Icones)