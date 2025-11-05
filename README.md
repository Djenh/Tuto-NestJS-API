<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Step by step guide to build a full NestJS REST API app with authentication, middlewares, roles and permissions, controllers and services.</p>


## 1. Project setup
Create the project folder by running the following command

```bash
nest new tuto-nest-api
```

Then choose `npm` or `yarn` or `pnpm` as your packages manager to craft the app. 
After creating the project go to it directory and open the project folder with your code editor.

```bash
cd new tuto-nest-api
```

```bash
npm install
```

Check if the project is well set up
```bash
npm run start:dev
```
And go to [http://localhost:3000/](http://localhost:3000/)
If everything runs well, you'll see a **`Hello World`** messsage



## 2. Settin up database

### 2.1. Install Prisma

Prisma is an open-source ORM for Node.js and TypeScript
```bash
npm install prisma --save-dev
```

Now create your initial Prisma setup using the init command of the Prisma CLI:

```bash
npx prisma init
```
This command creates a new prisma directory with `schema.prisma` and `.env` files
In the file `schema.prisma` ensure that you have the following lines
```typescript
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```
But it will depends of the database manager, you're using. Please check this link for others DB manager
[https://docs.nestjs.com/recipes/prisma#set-up-prisma](https://docs.nestjs.com/recipes/prisma#set-up-prisma)

Now, install `dotenv` package
```bash
npm install dotenv
```

In the file `prisma.config.ts` add the import package dotenv
```typescript
import "dotenv/config";
```

Check your `.env` file to ensure that the **DATABASE_URL** is correct.


### 2.2. Create migrations in Prisma

In the file `schema.prisma` create your models

Now run 
```bash
npx prisma migrate dev --name init
```

This command will create migrations in your database and it will automatically install Prisma Client
for your project if it not yet set up.
In case prisma clien is not installed with that command, please run the following one

```bash
npm install @prisma/client
```

As we run the command with `dev` option, you can now see a migration file created by Prisma in the
directory `prisma\migrations\2025...\migration.sql`


Everytime you modify your models, you need to run these commands
```bash
npx prisma generate
```

```bash
npx prisma migrate dev --name editmodels
```

### 2.3. Create Prisma module and service
We need to interact with our database.
```bash
nest generate module prisma
```

```bash
nest generate service prisma
```

Check the content of files `prisma.service.ts` and `prisma.module.ts` in my repository


### 2.3. Create resources based on models
For each model we have in our Prisma schema, we can create a resource for it. 
A resource will craft by default 
- DTO
- entities
- controller
- service
- module

Let's create for User, Service and Picture. While creating a resource, it will prompt in command line
to choose if it's for 
- REST API 
- GraphQL
- Microservice
- WebSockets
In our case, we'll choose REST API. And also, hit **Yes** when it asked would you like to generate CRUD entry points.

```bash
nest generate resource users
```

```bash
nest generate resource services
```

```bash
nest generate resource pictures
```
Differents folders are now created for each resource.
We will not use the `user.entity.ts` file created as we'll use Prisma related model directly.


### 2.4. Implement controller and service
In `user.module.ts` file, import *PrismaModule*

In `user.controller.ts` file, replace the DTO by this one `Prisma.UserCreateInput` and `Prisma.UserUpdateInput`

```typescript
import { Prisma } from 'generated/prisma';

create(@Body() createUserDto: Prisma.UserCreateInput) {
  return this.usersService.create(createUserDto);
}

@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: Prisma.UserUpdateInput) {
  return this.usersService.update(+id, updateUserDto);
}
```

In `user.service.ts` file, replace the DTO by this one `Prisma.UserCreateInput` and `Prisma.UserUpdateInput`
Also add constructor with PrismaService injected in it.


```typescript
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

constructor(private readonly prismaService: PrismaService){}

async create(createUserDto: Prisma.UserCreateInput): Promise<User> {
  return this.prismaService.user.create({
    data: createUserDto
  });
}
```
Check the content of files in my repository to see the full source code.

Now run 
```bash
npm run start:dev
```
And see if the command runs sucessfully.

If you have the following error
`**node:internal/modules/cjs/loader:1386 Error: Cannot find module '../../generated/prisma/index.js**`

Then go to `tsconfig.json` file at the root of your project folder and update these lines

```typescript
"module": "commonjs",
"moduleResolution": "node",
// "resolvePackageJsonExports": true,
"target": "ES2021",
```


In the file `tsconfig.build.json` add this line

```typescript
"include": ["src", "generated"],
```

Rebuild the Prisma client by running
```bash
npx prisma generate
```

```bash
npm run start:dev
```


## 3. Authentication with JWT (JSON Web Token)

### 3.1. Create files
Create a Auth module, controller and service

```bash
nest g module auth
```

```bash
nest g controller auth
```

```bash
nest g service auth
```

### 3.2. Create DTO (Data Transfer Object) files

Add class validator package
```bash
npm i --save class-validator class-transformer
```

Create a Login DTO file in auth folder `auth\dto\login.dto.ts`

```typescript
export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
	@IsString()
	@MinLength(4)
  password: string;
}
```


Create a Register DTO file in auth folder `auth\dto\register.dto.ts`

```typescript
export class RegisterDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    password: string;

    @IsString()
    @MinLength(8)
    phone: string;
}
```

Go to file `main.ts` and add this
```typescript
app.useGlobalPipes(new ValidationPipe());
```

Install bcrypt package
```bash
npm install bcrypt @types/bcrypt
```

```typescript
const password = await bcrypt.hash(data.password, 10);
```


### 3.3. Add JWT package

- Install JWT packages
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
```

- Generate a random JWT secret key for your project

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

```bash
npm install dotenv
```

- Add the secret string in you `.env` file
```bash
JWT_SECRET=723002aa4....
```

Now set up, the JWT module in the auth module. 

- Go to `auth.module.ts` file and add this
```typescript
imports: [
    JwtModule.register({
    secret: env('JWT_SECRET'),
    signOptions: { expiresIn: '1d'},
  })
],
```

- Go to `auth.service.ts` file and add **constructor()**

```typescript
constructor(private jwtService: JwtService) {}
```

- Go to `auth.controller.ts` file

```typescript
constructor(private authService: AuthService){}

@Post('login')
login(@Body() data: AuthDto) {
    const user = this.authService.validateUser(data);

    if(!user) throw new HttpException('Identifiants incorrects', 401);

    return user;
}
```


