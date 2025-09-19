import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from './User';

@Entity('messages')
export class Message extends BaseEntity {
  @Column('text')
  content: string;

  @Column({ default: 'text' })
  type: string;

  @Column({ default: 'user' })
  senderType: string;

  @Column({ nullable: true })
  fileUrl?: string;

  @Column({ nullable: true })
  fileName?: string;

  @Column({ default: false })
  isEdited: boolean;

  @Column({ nullable: true })
  editedAt?: Date;

  @Column({ nullable: true })
  aiModel?: string;

  @Column({ nullable: true })
  userId?: number;

  @Column({ nullable: true })
  senderName?: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: User;

  @Column({ nullable: true })
  senderAvatar?: string;

  @Column('json', { nullable: true })
  richContent?: any; 

  @Column({ nullable: true })
  templateType?: string; 

  @Column({ nullable: true })
  metadata?: string; 

  @ManyToOne('Conversation', 'messages')
  @JoinColumn({ name: 'conversationId' })
  conversation: any;

  @Column()
  conversationId: number;

  public getSenderDisplayName(): string {
    if (this.senderType === 'user' && this.senderName) {
      return this.senderName; 
    } else if (this.senderType === 'ai') {
      return 'AI'; 
    } else if (this.senderType === 'system') {
      return 'System';
    }
    return 'Unknown';
  }

  public isFromAI(): boolean {
    return this.senderType === 'ai';
  }

  public isFromUser(): boolean {
    return this.senderType === 'user';
  }

  public isSenderUser(): boolean {
    return this.senderType === 'user' && !!this.userId;
  }

  public isFromSystem(): boolean {
    return this.senderType === 'system';
  }

  public hasRichContent(): boolean {
    return this.richContent !== null && this.richContent !== undefined;
  }

  public isCarousel(): boolean {
    return this.type === 'carousel' || this.templateType === 'product_carousel';
  }

  public hasActionButtons(): boolean {
    return this.type === 'action_buttons' || this.templateType === 'action_buttons';
  }

  public getRichContent(): any {
    if (typeof this.richContent === 'string') {
      try {
        return JSON.parse(this.richContent);
      } catch (error) {
        console.error('Error parsing rich content JSON:', error);
        return null;
      }
    }
    return this.richContent;
  }

  public getMetadata(): any {
    if (this.metadata) {
      try {
        return JSON.parse(this.metadata);
      } catch (error) {
        console.error('Error parsing metadata JSON:', error);
        return null;
      }
    }
    return null;
  }
}