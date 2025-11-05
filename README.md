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


