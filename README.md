# wallet

## Features description

This is the a project that i'm doing for Compasso UOL fast track program.
With this project you can have your own cryptocurrencies wallet where you can: Create wallets for
your customers, list all wallets, list specific wallets using their addresses, add/remove funds to
someone's wallet, check an address transactions, transfer funds to another person's wallet
and delete a wallet!


## Authors

- [@algteixeira](https://www.github.com/algteixeira)

## Used technologies

**Server:** 
- NestJS v8.0.0
- TypeORM v0.2.41
- Reflect-Metadata v0.1.13
- POSTGRES v8.7.1
- Axios v0.25.0

**Tests:**
- Jest v27.2.5
- Supertest v6.1.3

**Client:**
- - SwaggerUI v4.3.0

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

Customize ormconfig.ts in order to adapt it to your database configuration
Don't forget to create your own local databases!

```typescript
  export const Config: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'your_host',
  port: 'port_where_your_db_is_running',
  username: 'your_user',
  password: 'your_pwd',
  database: 'your_db',
  entities: ["dist/src/**/entities/*.entity{.ts,.js}"],
  autoLoadEntities: true,
  synchronize: true,
}
```

...Additional info
```bash
  it runs at port 3000
```

## Documentation

To plot the documentation just run the following command in your browser while server is running

```bash
  http://localhost:3000/api-docs/
```
