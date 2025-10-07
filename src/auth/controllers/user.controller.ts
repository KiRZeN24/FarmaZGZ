import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { userSignDto } from '../dtos/user-sign.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';

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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserById(id);
  }

  @Get(':id/stats')
  async getUserStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.getUserStats(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.deleteUser(id);
  }
}
