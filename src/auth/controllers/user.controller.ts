import { Body, Controller, Post, Put, Get, Req } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { userSignDto } from '../dtos/user-sign.dto';
import { IsPublic } from '../decorators/is-public.decorator';
import { JwtPayload } from '../interfaces/auth.interface';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

@Controller('auth')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @IsPublic()
  @Post('signup')
  signUp(@Body() dto: userSignDto) {
    return this.userService.signUp(dto);
  }

  @IsPublic()
  @Post('signin')
  signIn(@Body() dto: userSignDto) {
    return this.userService.signIn(dto);
  }

  @Get('profile')
  getProfile(@Req() req: Request & { user: JwtPayload }) {
    const userId = req.user.id;
    return this.userService.getUserById(userId);
  }

  @Put('profile')
  updateProfile(
    @Req() req: Request & { user: JwtPayload },
    @Body() dto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    return this.userService.updateUser(userId, dto);
  }
}
