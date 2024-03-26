import { IsNotEmpty } from "class-validator";

export class CreateBannerDTO {
    @IsNotEmpty()
    title: string;
}