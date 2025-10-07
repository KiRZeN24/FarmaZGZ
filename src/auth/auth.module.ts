import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.model';
import { UserService } from './services/user.service';
import { UserController, UsersController } from './controllers/user.controller';
import { Validation } from 'src/validations/models/validation.model';

@Module({
  imports: [TypeOrmModule.forFeature([User, Validation])],
  providers: [UserService],
  controllers: [UserController, UsersController],
})
export class AuthModule {}
