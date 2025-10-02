import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { userSignDto } from '../dtos/user-sign.dto';
import { UserOutputDto } from '../dtos/user-ouput.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signUp(dto: userSignDto): Promise<UserOutputDto> {
    const userExists = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });

    if (userExists) {
      throw new BadRequestException(
        `El usuario ${dto.username} ya esta en uso`,
      );
    }

    const user = this.userRepository.create({
      username: dto.username,
      hashedPassword: await bcrypt.hash(dto.password, 10),
    });

    await this.userRepository.save(user);

    return UserOutputDto.fromEntity(user);
  }

  async signIn(dto: userSignDto): Promise<UserOutputDto> {
    const userExists = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });

    if (
      !userExists ||
      !(await bcrypt.compare(dto.password, userExists.hashedPassword))
    ) {
      throw new UnauthorizedException(`Credenciales incorrectas`);
    }

    return UserOutputDto.fromEntity(userExists);
  }
}
