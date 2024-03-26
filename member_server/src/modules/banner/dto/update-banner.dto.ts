import { AvailableStatus } from "@prisma/client";
import { Allow } from "class-validator";

export class UpdateBannerDTO{
    @Allow()
    title?:string

    @Allow()
    status?: AvailableStatus
}