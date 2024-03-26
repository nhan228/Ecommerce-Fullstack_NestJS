import { IsNotEmpty } from "class-validator";

export class CreateCategoryDTO {
    @IsNotEmpty()
    title: string;
    codeName: string;
}