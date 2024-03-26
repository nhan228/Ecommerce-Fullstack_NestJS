import { AvailableStatus } from "@prisma/client";
import { Allow } from "class-validator";

export class UpdateCategoryDTO{
    @Allow()
    title?:string

    @Allow()
    codeName?: string;

    @Allow()
    status?: AvailableStatus;
}