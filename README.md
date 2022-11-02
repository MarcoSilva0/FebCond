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
- JWT AUTH Laravel https://jwt-auth.readthedocs.io/en/develop/laravel-installation/  e add JWT_TTL=null pois usaremos um APP, dentro de jwt.php remova o exp de 'required_claims'

### Utilidade
- Para salvar os arquivos foi criado um storage no backend com a ferramenta storage do Laravel para criar foi utilizado o comando "php artisan storage:link"

## Back-end
- Para iniciar o servidor basta roda 'php artisan serve'
## Front-end
- Para iniciar o servidor basta roda 'npm start'
- Para o dashboard foi utilziado a biblioteca CoreUI Admin no ReacJs, template adquirido no repositório: https://github.com/coreui/coreui-free-react-admin-template