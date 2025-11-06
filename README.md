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



## 2. Setting up the database

### 2.1. Install Prisma

Prisma is an open-source ORM for Node.js and TypeScript
```bash
npm install prisma --save-dev
```
To hash password in database
```bash
npm install bcrypt @types/bcrypt
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
  //output   = "../generated/prisma"
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

After model is written, run command to format in Prisma tabulation
```bash
npm prisma format
```

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
npx prisma migrate dev --name edit_service_model
```

### 2.3. Create Prisma module and service
We need to interact with our database.
```bash
nest generate module prisma
```

```bash
nest generate service prisma
```

Check the content of files `prisma.service.ts` and `prisma.module.ts` in my repository for the complete source code.


### 2.3. Create resources based on models
For each model we have in our Prisma schema, we can create a resource for it. 
A resource will craft by default 
- DTO
- entity
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

```typescript
imports: [PrismaModule],
```


In `user.controller.ts` file, add constructor with PrismaService injected in it.

```typescript
constructor(private readonly usersService: UsersService) {}

@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}

...
```

In `user.service.ts` file, add constructor with PrismaService injected in it.

```typescript
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

constructor(private readonly prismaService: PrismaService){}

async create(createUserDto: CreateUserDto): Promise<User> {

  const existingUser = await this.prismaService.user.findUnique({
    where: { email: createUserDto.email },
  });

  if (existingUser) {
    throw new ConflictException('Cet email est déjà utilisé');
  }

  const passwordHash =  await bcrypt.hash(createUserDto.password, 10);

  const user = this.prismaService.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: passwordHash,
        phone: createUserDto.phone,
      }
    });

  return user;
}
...
```

Check the content of files in my Github repository to see the complete source code.

Now run 
```bash
npm run start:dev
```

And see if the command runs sucessfully.

> [!NOTE]  
> If you have the following error
`**Object.defineProperty(exports, "__esModule", { value: true }); ReferenceError: exports is not defined in ES module scope**`
> Then go to `tsconfig.json` file at the root of your project folder and update these lines

```typescript
"module": "commonjs",
"moduleResolution": "node",
// "resolvePackageJsonExports": true, // <---Delete this line
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

> [!NOTE]  
> If you have the following error
`**node:internal/modules/cjs/loader:1386 throw err;Error: Cannot find module '../../generated/prisma/index.js'**`
> Then go to `schema.prisma` file and remove the line `output   = "../generated/prisma"`

```typescript
generator client {
  provider = "prisma-client-js"
  // output   = "../generated/prisma" // <---Delete this line
}
```

In the file `prisma.service.ts`, make sure that the PrismaClient is imported from `@prisma/client`
```typescript
import { PrismaClient } from '@prisma/client';
```
Correct the import from other files where you use PrismaClient or Prisma.

```bash
rm -R generated
```

```bash
npx prisma generate
```

```bash
npm run start:dev
```


### 2.5. Test the endpoints
As our application represents a REST API, we'll prefix the routes with `\api\` text.
Go to `main.ts` file and add this

```typescript
sync function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api'); // <--- Set 'api' as prefix here

  await app.listen(process.env.PORT ?? 3000);
}
```
Now all endpoints will be in format **http://ip_address:3000/api/users**

With Postman or other API testing tool, test endpoints
- GET http://ip_address:3000/api/users
- GET http://ip_address:3000/api/users/1
- POST http://ip_address:3000/api/users



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

Create a Login and Register DTO file in auth folder

For example in `auth\dto\login.dto.ts` file, you have this

```typescript
export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;
  
  @IsString()
  @IsNotEmpty({ message: "Le mot de passe est requis" })
  @MinLength(4, { message: "Mot de passe : au moins 4 caractères requis" })
  @Matches(/(?=.*[a-z])/, {
      message: "Mot de passe : au moins une lettre minuscule requise"
  })
  @Matches(/(?=.*[A-Z])/, {
      message: "Mot de passe : au moins une lettre majuscule requise"
  })
  @Matches(/(?=.*\d)/, {
      message: "Mot de passe : au moins un chiffre requis"
  })
  @Matches(/(?=.*[@$!%*?&\-_#.,:;])/, {
      message: "Mot de passe : au moins un caractère spécial requis (@$!%*?&)"
  })
  password: string;
}
```


Go to file `main.ts` and add this
```typescript
app.useGlobalPipes(new ValidationPipe(
  {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }
));
```


### 3.3. Add JWT package

- Install JWT packages
```bash
npm install @nestjs/jwt @nestjs/passport passport passport-jwt passport-local
```

```bash
npm install --save-dev @types/passport-jwt @types/passport-local
```

- Install bcrypt package
```bash
npm install bcrypt @types/bcrypt
```

```typescript
const password = await bcrypt.hash(data.password, 10);
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
First of all, you need to implement a *ConfigModule* in order to read environment variables from `.env` file and set them up in a config file which will be available globally in your project.

Please check these tutorials to know exactly how to configure it.

[https://medium.com/@a.pouryousefi98/environment-variables-in-nestjs-5625047489da](https://medium.com/@a.pouryousefi98/environment-variables-in-nestjs-5625047489da)

[https://dev.to/gmdias727/how-to-set-up-env-variables-in-a-nestjs-project-1o25](https://dev.to/gmdias727/how-to-set-up-env-variables-in-a-nestjs-project-1o25)


- Go to `auth.module.ts` file and add this
```typescript
imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (config) =>({
        secret: await config.get('jwt.secret'), 
        signOptions: { expiresIn: '1d'},
      }),
  })
],
```

- Create a JwtStrategy file. It defines how to NestJs will decode and validate our JWT tokens which come from any request.
Please check my repository for full source code in `src\auth\jwt.strategy.ts` file.

- Add *PassportModule* also in *imports* array. And add JwtStrategy and PrismaService in *providers* array.

- Finally, the file `auth.module.ts` looks like
```typescript
@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (config) =>({
        secret: await config.get('jwt.secret'), 
        signOptions: { expiresIn: '1d'},
      }),
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, PrismaService]
})
export class AuthModule {}
```


- Go to `auth.service.ts` file and add **constructor()**

```typescript
constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService
) {}
```

- Go to `auth.controller.ts` file

```typescript
constructor(private readonly authService: AuthService){}
```

### 3.4. Implement Authentication code

Check my repository to get full source code of implementation of functions in `auth.service.ts` file
- register
- login
-validate

In order to protect the route `GET /profile` from non-authenticate users, we will add a **Guard auth** in the controller for this route.

So create a file `src\auth\jwt.guard.ts` and add source code from my repository.

Come back in `src\auth\auth.controller.ts` file and add Guard decorator for controller Get Profile.

```typescript
@UseGuards(JwtAuthGuard)
@Get('profile')
async profile(@Request() req) {
    return this.authService.validate(req.user.sub);
}
```

Now you can test your application 

```bash
npm run start:dev
```

With Postman or other API testing tool, test endpoints
- GET http://ip_address:3000/api/auth/register
- GET http://ip_address:3000/api/auth/login
- POST http://ip_address:3000/api/auth/profile

If you want to see your access token payload, go to JWT website and paste the token

[https://www.jwt.io/](https://www.jwt.io/)

