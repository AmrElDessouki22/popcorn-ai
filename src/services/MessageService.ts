import { IService } from './interfaces/IService';
import { dbConnection } from '@/lib/database';
import { MessageRepository } from '@/repositories/MessageRepository';
import { Message } from '@/models/Message';

export class MessageService implements IService<Message> {
  private messageRepository: MessageRepository;

  constructor() {
    if (!dbConnection.isDatabaseConnected()) {
      throw new Error('Database connection not initialized. Call dbConnection.connect() first.');
    }
    this.messageRepository = new MessageRepository(dbConnection.getDataSource());
  }

  public async findById(id: number): Promise<Message | null> {
    try {
      return await this.messageRepository.findById(id);
    } catch (error) {
      console.error('Error finding message by ID:', error);
      throw error;
    }
  }

  public async findAll(): Promise<Message[]> {
    try {
      return await this.messageRepository.findActiveMessages();
    } catch (error) {
      console.error('Error finding all messages:', error);
      throw error;
    }
  }

  public async create(messageData: Partial<Message>): Promise<Message> {
    try {
      if (!messageData.content || !messageData.conversationId) {
        throw new Error('content and conversationId are required');
      }

      return await this.messageRepository.create(messageData);
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  public async update(id: number, messageData: Partial<Message>): Promise<Message | null> {
    try {
      const existingMessage = await this.messageRepository.findById(id);
      if (!existingMessage) {
        throw new Error('Message not found');
      }

      return await this.messageRepository.update(id, messageData);
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      return await this.messageRepository.softDelete(id);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }

  public async restore(id: number): Promise<boolean> {
    try {
      return await this.messageRepository.restore(id);
    } catch (error) {
      console.error('Error restoring message:', error);
      throw error;
    }
  }

  public async hardDelete(id: number): Promise<boolean> {
    try {
      return await this.messageRepository.hardDelete(id);
    } catch (error) {
      console.error('Error hard deleting message:', error);
      throw error;
    }
  }

  /**
   * Find messages by conversation ID
   * @param conversationId - Conversation ID
   * @returns Promise<Message[]>
   */
  public async findByConversationId(conversationId: number): Promise<Message[]> {
    try {
      return await this.messageRepository.findByConversationId(conversationId);
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
      return await this.messageRepository.findByUserId(userId);
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
      return await this.messageRepository.findBySenderType(senderType);
    } catch (error) {
      console.error('Error finding messages by sender type:', error);
      throw error;
    }
  }
}