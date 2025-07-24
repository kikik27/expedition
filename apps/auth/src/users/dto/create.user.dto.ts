import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, IsUUID, Min } from "class-validator";

export class CreateUserDTO {
  @IsString()
  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  username: string;

  // @Min(8)
  @IsString()
  @ApiProperty({ example: 'password123', description: 'Password for the user account' })
  password: string;

  @IsEmail()
  @IsString()
  @ApiProperty({ example: 'johndoeemail.com', description: 'Email address of the user' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  first_name: string;

  @IsString()
  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  last_name: string;

  @IsUUID()
  @ApiProperty({ example: 'role_id_123', description: 'ID of the role assigned to the user' })
  role_id: string;
}