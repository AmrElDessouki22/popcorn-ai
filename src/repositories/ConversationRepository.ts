import { DataSource } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { Conversation } from '@/models/Conversation';

export class ConversationRepository extends BaseRepository<Conversation> {
  constructor(dataSource: DataSource) {
    super(dataSource, Conversation);
  }

  /**
   * Find conversations by user ID
   * @param userId - User ID
   * @returns Promise<Conversation[]>
   */
  public async findByUserId(userId: number): Promise<Conversation[]> {
    try {
      return await this.repository.find({
        where: { userId },
        order: { lastMessageAt: 'DESC', createdAt: 'DESC' },
        relations: ['user', 'messages']
      });
    } catch (error) {
      console.error('Error finding conversations by user ID:', error);
      throw error;
    }
  }

  /**
   * Find active conversations by user ID
   * @param userId - User ID
   * @returns Promise<Conversation[]>
   */
  public async findActiveByUserId(userId: number): Promise<Conversation[]> {
    try {
      return await this.repository.find({
        where: { userId, isActive: true },
        order: { lastMessageAt: 'DESC', createdAt: 'DESC' },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error finding active conversations by user ID:', error);
      throw error;
    }
  }

  /**
   * Find all active conversations
   * @returns Promise<Conversation[]>
   */
  public async findActiveConversations(): Promise<Conversation[]> {
    try {
      return await this.repository.find({
        where: { isActive: true },
        order: { lastMessageAt: 'DESC', createdAt: 'DESC' },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error finding active conversations:', error);
      throw error;
    }
  }

  /**
   * Find conversations by type
   * @param type - Conversation type
   * @returns Promise<Conversation[]>
   */
  public async findByType(type: string): Promise<Conversation[]> {
    try {
      return await this.repository.find({
        where: { type, isActive: true },
        order: { lastMessageAt: 'DESC', createdAt: 'DESC' },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error finding conversations by type:', error);
      throw error;
    }
  }

  /**
   * Get conversation with messages
   * @param id - Conversation ID
   * @returns Promise<Conversation | null>
   */
  public async findWithMessages(id: number): Promise<Conversation | null> {
    try {
      return await this.repository.findOne({
        where: { id },
        relations: ['user', 'messages', 'messages.user'],
        order: { messages: { createdAt: 'ASC' } }
      });
    } catch (error) {
      console.error('Error finding conversation with messages:', error);
      throw error;
    }
  }
}