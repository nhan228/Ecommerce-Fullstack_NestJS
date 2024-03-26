import { Allow, IsNotEmpty } from "class-validator";

export class userLoginDTO {
    @IsNotEmpty({ message: "Username is required" })
    loginInfo: string

    @IsNotEmpty({ message: "Password is required" })
    password: string

}