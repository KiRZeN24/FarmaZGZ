import { User, UserRole } from '../models/user.model';

export class UserOutputDto {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly role: UserRole,
    readonly createdAt: Date,
  ) {}

  static fromEntity(user: User): UserOutputDto {
    return new UserOutputDto(user.id, user.username, user.role, user.createdAt);
  }
}
