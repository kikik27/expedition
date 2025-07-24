import { UserDto } from "../users/dto/user.dto";

export interface RequestWithUser extends Request {
  user: UserDto;
}
