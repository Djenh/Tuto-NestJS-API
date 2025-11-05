import { Controller, Body, Post, HttpException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    login(@Body() data: LoginDto) {
        const user = this.authService.validateUser(data);

        if(!user) throw new HttpException('Identifiants incorrects', 401);

        return user;
    }


    @Post('login')
    register(@Body() data: RegisterDto) {
        return this.authService.registerUser(data);
    }
}
