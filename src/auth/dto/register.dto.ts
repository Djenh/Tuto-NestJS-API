import { IsString, IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

export class RegisterDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{4,}$/, 
        {
        message: "Le mot de passe doit avoir au moins 4 caractères et contenir au moins une lettre majuscule, un chiffre et caractère spécial",
      })
    password: string;

    @IsString()
	@MinLength(8)
	phone: string;
}
