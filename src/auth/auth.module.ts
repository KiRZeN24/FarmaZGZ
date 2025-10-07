import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { Validation } from '../validations/models/validation.model';
import { UsersController } from './controllers/users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Validation])],
  providers: [UserService],
  controllers: [UserController, UsersController],
})
export class AuthModule {}
