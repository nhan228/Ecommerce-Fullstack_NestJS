import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";

export class CreateUserDTO {
    @IsNotEmpty({ message: "FirstName is required" })
    @IsString()
    firstName: string;

    @IsNotEmpty({ message: "LastName is required" })
    @IsString()
    lastName: string;

    @IsNotEmpty({ message: "Username is required" })
    @Matches(/^[^\s-]+$/, { message: "Username cannot contain spaces or dashes" })
    @MinLength(3, { message: "Username must be at least 3 characters long" })
    @MaxLength(18, { message: "Username must not be longer than 18 characters" })
    @IsString()
    userName: string

    @IsNotEmpty({ message: "Email is required" })
    @IsEmail({}, { message: "Email is invalid" })
    @IsString()
    email: string

    @IsNotEmpty({ message: "Password is required" })
    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(12, { message: 'Password must not be longer than 12 characters' })
    @Matches(/^[^\s]+$/, { message: 'Password cannot contain spaces' })
    password: string
}
