import { IsOptional, IsString } from "class-validator";

export class createFileDto{
    @IsString()
    @IsOptional()
    description?: string
}