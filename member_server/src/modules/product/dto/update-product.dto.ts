import { AvailableStatus } from "@prisma/client";
import { Allow } from "class-validator";

export class UpdateProductDTO{
    @Allow()
    title?:string

    @Allow()
    status?: AvailableStatus
}