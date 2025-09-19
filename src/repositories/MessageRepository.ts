import { DataSource } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { Message } from '@/models/Message';

export class MessageRepository extends BaseRepository<Message> {
  constructor(dataSource: DataSource) {
    super(dataSource, Message);
  }

  /**
   * Find messages by conversation ID
   * @param conversationId - Conversation ID
   * @returns Promise<Message[]>
   */
  public async findByConversationId(conversationId: number): Promise<Message[]> {
    try {
      return await this.repository.find({
        where: { conversationId },
        order: { createdAt: 'ASC' },
        relations: ['user', 'conversation']
      });
    } catch (error) {
      console.error('Error finding messages by conversation ID:', error);
      throw error;
    }
  }

  /**
   * Find messages by user ID
   * @param userId - User ID
   * @returns Promise<Message[]>
   */
  public async findByUserId(userId: number): Promise<Message[]> {
    try {
      return await this.repository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
        relations: ['user', 'conversation']
      });
    } catch (error) {
      console.error('Error finding messages by user ID:', error);
      throw error;
    }
  }

  /**
   * Find messages by sender type
   * @param senderType - Sender type ('user', 'ai', 'system')
   * @returns Promise<Message[]>
   */
  public async findBySenderType(senderType: string): Promise<Message[]> {
    try {
      return await this.repository.find({
        where: { senderType },
        order: { createdAt: 'DESC' },
        relations: ['user', 'conversation']
      });
    } catch (error) {
      console.error('Error finding messages by sender type:', error);
      throw error;
    }
  }

  /**
   * Find all active messages
   * @returns Promise<Message[]>
   */
  public async findActiveMessages(): Promise<Message[]> {
    try {
      return await this.repository.find({
        order: { createdAt: 'DESC' },
        relations: ['user', 'conversation']
      });
    } catch (error) {
      console.error('Error finding active messages:', error);
      throw error;
    }
  }

  /**
   * Find messages by type
   * @param type - Message type
   * @returns Promise<Message[]>
   */
  public async findByType(type: string): Promise<Message[]> {
    try {
      return await this.repository.find({
        where: { type },
        order: { createdAt: 'DESC' },
        relations: ['user', 'conversation']
      });
    } catch (error) {
      console.error('Error finding messages by type:', error);
      throw error;
    }
  }

  /**
   * Find messages with rich content
   * @returns Promise<Message[]>
   */
  public async findWithRichContent(): Promise<Message[]> {
    try {
      return await this.repository
        .createQueryBuilder('message')
        .where('message.richContent IS NOT NULL')
        .orderBy('message.createdAt', 'DESC')
        .leftJoinAndSelect('message.user', 'user')
        .leftJoinAndSelect('message.conversation', 'conversation')
        .getMany();
    } catch (error) {
      console.error('Error finding messages with rich content:', error);
      throw error;
    }
  }

  /**
   * Get message count by conversation
   * @param conversationId - Conversation ID
   * @returns Promise<number>
   */
  public async getCountByConversation(conversationId: number): Promise<number> {
    try {
      return await this.repository.count({
        where: { conversationId }
      });
    } catch (error) {
      console.error('Error getting message count by conversation:', error);
      throw error;
    }
  }

  /**
   * Get latest message in conversation
   * @param conversationId - Conversation ID
   * @returns Promise<Message | null>
   */
  public async getLatestByConversation(conversationId: number): Promise<Message | null> {
    try {
      return await this.repository.findOne({
        where: { conversationId },
        order: { createdAt: 'DESC' },
        relations: ['user']
      });
    } catch (error) {
      console.error('Error getting latest message by conversation:', error);
      throw error;
    }
  }
}