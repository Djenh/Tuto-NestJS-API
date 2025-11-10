import { Controller, Body, Post, Get, Request, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    async register(@Body() data: RegisterDto) {
        return this.authService.register(data);
    }


    @Post('login')
    login(@Body() data: LoginDto) {
        return this.authService.login(data);
    }
      

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    async profile(@Request() req) {
        return this.authService.validate(req.user.sub);
    }
}
