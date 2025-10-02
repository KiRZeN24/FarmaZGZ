import { User } from '../models/user.model';

export class UserOutputDto {
  constructor(
    readonly id: string,
    readonly username: string,
  ) {}

  static fromEntity(user: User): UserOutputDto {
    return new UserOutputDto(user.id, user.username);
  }
}
