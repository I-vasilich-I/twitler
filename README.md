# Aqua Playground - Twitler

## Description

Aqua Playground is a fullstack project. In my case it's a shallow and simplified copy of the [Twitter](https://twitter.com/) named `Twitler`.

[Video demo](https://syberrycorp-my.sharepoint.com/personal/o_vaskevich_syberry_com/_layouts/15/guestaccess.aspx?share=EfXlyFG3ozRFpb61XAJ4TpUBkmnCJ_TNnjUjlEdAsrBDzQ&email=o.vaskevich%40syberry.com)

For frontend I heavily used `Ant Design` on `create react app` template, which made it painfully to adjust styles(styled-jsx and cra not a good combo).  
State management and API request are handled by `Redux Toolkit` and `RTK Query`, which includes caching, so sometimes there's no request to backend are made cause data is in the cache.

For backend I used `JavaScript`, `Express`, `MySQL` and `Prisma` ORM. I chose `Prisma` because I haven't used it before, so I'd learn it in the process. I requested to use `Nest/TypeScript`, but was told to use `Express`. File structure somewhat influenced by `Nest` and taking in account that `Express` doesn't care much about structure I guess it's ok.  

## Stack

|Component|Technologies|
|---|:---|
|Programming languages| JavaScript / TypeScript
|Database|Mysql|
|API| Postman|
|Backend| Express / Prisma|
|Frontend|React / Redux Toolkit / RTK Query / Ant Design / Sass|
|Container tool| Docker|
|Testing|Jest|

## Documents

- [FR](/FR.md)
- [TD](/Twitler_Technical_Design.md)

## How to run the project

Clone repository

```bash
git clone https://git.syberry.com/o.vaskevich/aqua-playground.git
```

Go to `aqua-playground` folder

```bash
cd ./aqua-playground
```

Switch to `development` branch

```bash
git checkout development
```

### Backend [BE]

Go to `server` folder

```bash
cd ./server
```

#### [BE] Installation

```bash
npm install
```

Change file name and adjust variables if needed

```string
.env.example -> .env
```

#### [BE] Running server

- run containers(requires [Docker](https://www.docker.com/))

  ```bash
  npm run docker
  ```

- open another terminal window and run prisma migration

  ```bash
  npm run prisma:migrate
  ```

#### [BE] Direct database manipulations

- start and open prisma studio on <http://localhost:5555>

  ```bash
  npm run prisma:studio
  ```

#### [BE] Unit tests

- run all tests

  ```bash
  npm run test
  ```

- run all tests in watch mode

  ```bash
  npm run test:watch
  ```

- run tests coverage

  ```bash
  npm run test:cov
  ```

### Frontend [FE]

Go to `client` folder

```bash
cd ../client
```

#### [FE] Installation

```bash
npm install
```

#### [FE] Running client

  ```bash
  npm run start
  ```

## Known issues

- New tweet form allows you to select who can reply to the tweet(everyone/people you follow), so this data is indeed stored in DB, but on the FE it isn't used anywhere at the moment.
- On `sign up` server attempts to send an activation email and stores link in DB, but on the FE it isn't used anywhere at the moment. If there's some troubles with sending email, it'll be logged, and sign up process will continue. As a matter of fact that's the reason why sign up takes a few more seconds to proceed than signin.
- Pagination on Tweets and Comments. As soon as the app has more tweets and comments(like 100+), it'll became more and more laggy. Would be nice to load tweets and comments partially, based on what user can see on the screen and add pagination options to requests on BE.
- FE doesn't allow user to edit/delete tweets/comments, though BE has those endpoints.
- I haven't paid much attention to responsiveness, `Ant Design` handles it up to some point, but there most likely are some edge cases where view would brake. Overall app looks fine on `width > 600px`
- No unit tests for FE
