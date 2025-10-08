import {
  Body,
  Controller,
  Post,
  Put,
  Get,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { userSignDto } from '../dtos/user-sign.dto';
import { UpdateProfileDto } from '../dtos/update-profile.dto';
import { IsPublic } from '../decorators/is-public.decorator';

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

  @Get('profile/:userId')
  getProfile(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.userService.getUserById(userId);
  }

  @Put('profile/:userId')
  updateProfile(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(userId, dto);
  }
}
