import { IsNotEmpty } from "class-validator";

export class CreateBrandDTO {
    @IsNotEmpty()
    title: string;
    codeName: string;
}