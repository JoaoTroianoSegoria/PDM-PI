# Aplicativo Univer

Aplicativo acadêmico feito com Expo e React Native. A versão atual usa uma API própria para autenticar o aluno e carregar dados de carteirinha, disciplinas, boletim, faturas, agenda e biblioteca.

## Estrutura

```text
PDM-PI/
  Aplicativo-Univer/       app Expo/React Native
  Aplicativo-Univer-api/   API Node.js/Express/Prisma/MySQL
```

## Pré-requisitos

- Node.js LTS.
- npm.
- MySQL Server.
- MySQL Workbench ou outro cliente MySQL.
- Expo Go no celular ou emulador Android.
- Postman, opcional.

## Banco De Dados

Crie o banco:

```sql
CREATE DATABASE univer;
```

Crie um usuário para o projeto:

```sql
CREATE USER IF NOT EXISTS 'univer_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'univer123';
CREATE USER IF NOT EXISTS 'univer_user'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'univer123';
ALTER USER 'univer_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'univer123';
ALTER USER 'univer_user'@'127.0.0.1' IDENTIFIED WITH mysql_native_password BY 'univer123';
GRANT ALL PRIVILEGES ON univer.* TO 'univer_user'@'localhost';
GRANT ALL PRIVILEGES ON univer.* TO 'univer_user'@'127.0.0.1';
FLUSH PRIVILEGES;
```

O Prisma não consegue conectar quando o usuário do MySQL está usando o plugin `sha256_password`. Por isso os comandos acima forçam `mysql_native_password`.

## Rodar A API

Em um terminal:

```bash
cd /var/home/joaopedro/PDM-PI/Aplicativo-Univer-api
npm install
cp .env.example .env
```

No `.env`, use:

```env
DATABASE_URL="mysql://univer_user:univer123@127.0.0.1:3306/univer"
PORT=3001
JWT_SECRET="univer-dev-secret"
```

Depois rode:

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

## Rodar O App

Em outro terminal:

```bash
cd /var/home/joaopedro/PDM-PI/Aplicativo-Univer
npm install
cp .env.example .env
npm start
```

No emulador Android, o app usa automaticamente `http://10.0.2.2:3001`.

Em celular físico, coloque o IP do computador no `.env`:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:3001
```

Depois reinicie o Expo:

```bash
npx expo start --clear
```

## Login De Teste

O seed cria este aluno:

```text
Usuário: 2512130067
Senha/CPF: 52998224725
```

## Testar No Postman

Importe:

```text
Aplicativo-Univer-api/postman/collection.json
```

A Collection faz login, salva o token e testa as rotas protegidas.

## Comandos Úteis

Na API:

```bash
npm run dev
npm run prisma:migrate
npm run prisma:push
npm run prisma:seed
npm run prisma:studio
```

No app:

```bash
npm start
npm run android
npm run web
```
