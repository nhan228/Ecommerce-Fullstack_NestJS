import { IsNotEmpty } from "class-validator";

export class CreateProductDTO {
    @IsNotEmpty()
    title: string;
}