# UniPortal - Aplicativo Univer

Aplicativo acadêmico desenvolvido com Expo/React Native e integrado a uma API Node.js com Express, Prisma e MySQL.

O projeto permite autenticar um aluno, carregar dados acadêmicos do banco e visualizar informações de início, disciplinas, boletim, carteirinha, faturas e biblioteca.

## Integrantes

- João Otavio Troiano Segoria
- João Pedro Gonçalves Campos Silva
- Gabriel Castagnaro Macêdo

## Estrutura Do Projeto

```text
PDM-PI/
  Aplicativo-Univer/       aplicativo mobile em Expo/React Native
  Aplicativo-Univer-api/   API em Node.js/Express/Prisma/MySQL
```

## Funcionalidades

- Login com matrícula e CPF.
- Autenticação via token JWT.
- Mensagem de boas-vindas com o nome do aluno autenticado.
- Integração do frontend com API HTTP.
- Dados salvos e lidos em banco MySQL.
- Tela inicial com aula do dia, fatura pendente e pendência de biblioteca.
- Lista de disciplinas atuais e histórico acadêmico.
- Boletim com cálculo de média, frequência e situação do aluno.
- Carteirinha estudantil digital.
- Faturas pendentes e histórico de pagamentos.
- Tema claro/escuro.
- Collection do Postman para testar os endpoints.

## Tecnologias

- React Native
- Expo
- React Navigation
- AsyncStorage
- Node.js
- Express
- Prisma ORM
- MySQL
- Zod
- JWT
- bcryptjs

## Pré-Requisitos

Instale antes de rodar:

- Node.js LTS
- npm
- MySQL Server
- Expo Go no celular ou emulador Android
- Postman, opcional para testar a API

## Configurar O Banco

Abra o MySQL como administrador/root e rode:

```sql
CREATE DATABASE IF NOT EXISTS univer;

CREATE USER IF NOT EXISTS 'univer_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'univer123';
CREATE USER IF NOT EXISTS 'univer_user'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'univer123';

ALTER USER 'univer_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'univer123';
ALTER USER 'univer_user'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'univer123';

GRANT ALL PRIVILEGES ON univer.* TO 'univer_user'@'localhost';
GRANT ALL PRIVILEGES ON univer.* TO 'univer_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

O `mysql_native_password` evita erro de autenticação do Prisma com alguns MySQL instalados localmente.

## Rodar A API

Em um terminal:

```bash
cd Aplicativo-Univer-api
npm install
cp .env.example .env
```

No arquivo `.env`, use:

```env
DATABASE_URL="mysql://univer_user:univer123@127.0.0.1:3306/univer"
PORT=3001
JWT_SECRET="univer-dev-secret"
```

Depois execute:

```bash
npm run prisma:push
npm run prisma:seed
npm run dev
```

Teste no navegador:

```text
http://localhost:3001
```

Resposta esperada:

```json
{
  "ok": true,
  "name": "aplicativo-univer-api"
}
```

## Rodar O Aplicativo

Em outro terminal:

```bash
cd Aplicativo-Univer
npm install
cp .env.example .env
npm start
```

No emulador Android, o app usa automaticamente:

```text
http://10.0.2.2:3001
```

No celular físico, coloque o IP do computador no arquivo `Aplicativo-Univer/.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:3001
```

Depois reinicie o Expo limpando o cache:

```bash
npx expo start --clear
```

## Login De Teste

O seed cria um aluno de demonstração:

```text
Usuário: 2512130067
Senha/CPF: 52998224725
```

## Testes No Postman

Importe a collection:

```text
Aplicativo-Univer-api/postman/collection.json
```

A collection possui o login, salva o token JWT e testa as rotas protegidas.

## Comandos Úteis

API:

```bash
npm run dev
npm run prisma:push
npm run prisma:seed
npm run prisma:studio
```

Aplicativo:

```bash
npm start
npm run android
npm run web
```

## Observações Para Entrega

- Não versionar `.env`, `.expo` ou `node_modules`.
- Versionar `.env.example`, `package.json`, `package-lock.json`, `prisma/schema.prisma`, migrations, seed e collection do Postman.
- Antes da apresentação, deixe o MySQL e a API rodando.
