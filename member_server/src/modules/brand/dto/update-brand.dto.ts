import { AvailableStatus } from "@prisma/client";
import { Allow } from "class-validator";

export class UpdateBrandDTO{
    @Allow()
    title?:string

    @Allow()
    codeName?: string;

    @Allow()
    status?: AvailableStatus;
}