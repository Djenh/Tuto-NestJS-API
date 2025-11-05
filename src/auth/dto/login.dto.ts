import { IsString, IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';

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
