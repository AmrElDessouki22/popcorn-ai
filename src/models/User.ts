import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Role } from './Role';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({ nullable: true })
  roleId?: number;

  @OneToMany('Message', 'user')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];

  @OneToMany('Conversation', 'user')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversations: any[];
}