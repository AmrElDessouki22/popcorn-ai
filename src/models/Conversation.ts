import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ nullable: true })
  title?: string;

  @Column({ default: 'assistant' })
  type: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastMessageAt?: Date;

  @ManyToOne(() => User, user => user.conversations)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @OneToMany('Message', 'conversation')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
}