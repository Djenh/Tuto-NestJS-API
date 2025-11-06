import { ConflictException, HttpException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prismaService: PrismaService
    ) {}
    

    async register(data: RegisterDto){
        const existingUser = await this.prismaService.user.findUnique({
            where: {email: data.email}
        });

        if(existingUser) throw new ConflictException("Email déjà existant");

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await this.prismaService.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash,
                phone: data.phone
            }
        });

        const payload = {sub: user.id, email: user.email};
        const access_token = await this.jwtService.signAsync(payload);

        return {user, access_token};
    }


    async login(data: LoginDto){
        const user = await this.prismaService.user.findUnique({
            where: {email: data.email}
        });

        if(!user) throw new UnauthorizedException("Email et/ou mot de passe incorrect");

        const isPassValid = await bcrypt.compare(data.password, user.password);

        if(!isPassValid) throw new UnauthorizedException("Email et/ou mot de passe incorrect");

        const payload = {sub: user.id, email: user.email};
        const access_token = await this.jwtService.signAsync(payload);

        return {user, access_token};
    }


    async validate(userId: number){
        const user = await this.prismaService.user.findUnique({
            where: {id: userId},
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                createdAt: true
            }
        });

        return user;        
    }
}
