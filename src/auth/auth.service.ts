import { HttpException, Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

const fakeUsers = [
  {
    id: 1,
    email: 'anson@gmail.com',
    password: 'password',
  },
  {
    id: 2,
    email: 'jack@gmail.com',
    password: 'password123',
  },
];


@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) {}
    
    async validateUser({email, password}: LoginDto){
        const findUser = fakeUsers.find((user) => user.email === email);

        if (!findUser) return null;

        // const passwordHash = await bcrypt.compare(password, findUser.password);

        if (password === findUser.password) {
        // if (passwordHash) {
            const { password, ...user } = findUser;
            return this.jwtService.sign(user);
        }
        else{
            throw new HttpException('Identifiants incorrects', 401);
        }
    }

    async registerUser(data: RegisterDto){
        const findUser = fakeUsers.find((user) => user.email === data.email);

        if (findUser){
            throw new HttpException('Email déjà utilisé', 400);
        }
        else {
            const password = await bcrypt.hash(data.password, 10);

            // return this.jwtService.sign(findUser);
        }
    }
}
