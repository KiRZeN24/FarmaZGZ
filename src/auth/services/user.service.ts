import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { userSignDto } from '../dtos/user-sign.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserOutputDto } from '../dtos/user-output.dto';
import { hash, compare } from 'bcrypt';
import { Validation } from '../../validations/models/validation.model';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Validation)
    private readonly validationRepository: Repository<Validation>,
  ) {}

  async signUp(dto: userSignDto): Promise<UserOutputDto> {
    const userExists = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (userExists) {
      throw new BadRequestException(
        `El usuario ${dto.username} ya esta en uso`,
      );
    }

    const user = this.userRepository.create({
      username: dto.username,
      hashedPassword: await hash(dto.password, 10),
    });

    await this.userRepository.save(user);
    return UserOutputDto.fromEntity(user);
  }

  async signIn(dto: userSignDto): Promise<UserOutputDto> {
    const userExists = await this.userRepository.findOne({
      where: { username: dto.username },
    });

    if (
      !userExists ||
      !(await compare(dto.password, userExists.hashedPassword))
    ) {
      throw new UnauthorizedException(`Credenciales incorrectas`);
    }

    return UserOutputDto.fromEntity(userExists);
  }

  async getAllUsers(): Promise<UserOutputDto[]> {
    const users = await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
    return users.map((user) => UserOutputDto.fromEntity(user));
  }

  async getUserById(id: string): Promise<UserOutputDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return UserOutputDto.fromEntity(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserOutputDto> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    if (dto.username && dto.username !== user.username) {
      const existingUser = await this.userRepository.findOne({
        where: { username: dto.username },
      });

      if (existingUser) {
        throw new BadRequestException(
          `El usuario ${dto.username} ya está en uso`,
        );
      }
    }

    if (dto.username) user.username = dto.username;
    if (dto.role) user.role = dto.role;
    if (dto.password) {
      user.hashedPassword = await hash(dto.password, 10);
    }

    const updatedUser = await this.userRepository.save(user);
    return UserOutputDto.fromEntity(updatedUser);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    await this.validationRepository.delete({ userId: id });

    await this.userRepository.remove(user);

    return { message: `Usuario ${user.username} eliminado correctamente` };
  }

  async getUserStats(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return {
      user: UserOutputDto.fromEntity(user),
      stats: {
        totalValidations: 0,
        correctValidations: 0,
        incorrectValidations: 0,
        validationPercentage: 0,
      },
    };
  }
}
