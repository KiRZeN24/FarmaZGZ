import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/models/user.model';
import { Pharmacie } from '../../pharmacies/models/pharmacie.model';

@Entity('validations')
export class Validation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  pharmacyId: string;

  @Column({ type: 'boolean' })
  isValid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { eager: false })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Pharmacie, { eager: false })
  @JoinColumn({ name: 'pharmacyId' })
  pharmacy: Pharmacie;
}
