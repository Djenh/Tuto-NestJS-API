import { BadRequestException } from "@nestjs/common";
import { Request } from "express"
import { extname } from "path";

export const fileNameEditor = (req: Request, file: any, callback: (error: any, filename)=>void,)=>{

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);

    const newFileName = uniqueSuffix + ext;

    callback(null, newFileName);
}


export const imageFileFilter = (req: Request, file: any, callback: (error: any, valid: boolean)=>void,) =>{
    if (!file.originalname || !file.originalname.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) {
    return callback(new BadRequestException("Type de fichier incorrect"), false);
}
    callback(null, true);

}