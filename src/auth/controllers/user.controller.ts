import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { userSignDto } from '../dtos/user-sign.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('signup')
  signUp(@Body() dto: userSignDto) {
    return this.userService.signUp(dto);
  }

  @Post('signin')
  signIn(@Body() dto: userSignDto) {
    return this.userService.signIn(dto);
  }
}
