import { IService } from './interfaces/IService';
import { dbConnection } from '@/lib/database';
import { ConversationRepository } from '@/repositories/ConversationRepository';
import { Conversation } from '@/models/Conversation';

export class ConversationService implements IService<Conversation> {
  private conversationRepository: ConversationRepository;

  constructor() {
    if (!dbConnection.isDatabaseConnected()) {
      throw new Error('Database connection not initialized. Call dbConnection.connect() first.');
    }
    this.conversationRepository = new ConversationRepository(dbConnection.getDataSource());
  }

  public async findById(id: number): Promise<Conversation | null> {
    try {
      return await this.conversationRepository.findById(id);
    } catch (error) {
      console.error('Error finding conversation by ID:', error);
      throw error;
    }
  }

  public async findAll(): Promise<Conversation[]> {
    try {
      return await this.conversationRepository.findActiveConversations();
    } catch (error) {
      console.error('Error finding all conversations:', error);
      throw error;
    }
  }

  public async create(conversationData: Partial<Conversation>): Promise<Conversation> {
    try {
      if (!conversationData.userId) {
        throw new Error('userId is required');
      }

      return await this.conversationRepository.create(conversationData);
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }

  public async update(id: number, conversationData: Partial<Conversation>): Promise<Conversation | null> {
    try {
      const existingConversation = await this.conversationRepository.findById(id);
      if (!existingConversation) {
        throw new Error('Conversation not found');
      }

      return await this.conversationRepository.update(id, conversationData);
    } catch (error) {
      console.error('Error updating conversation:', error);
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      return await this.conversationRepository.softDelete(id);
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }

  public async restore(id: number): Promise<boolean> {
    try {
      return await this.conversationRepository.restore(id);
    } catch (error) {
      console.error('Error restoring conversation:', error);
      throw error;
    }
  }

  public async hardDelete(id: number): Promise<boolean> {
    try {
      return await this.conversationRepository.hardDelete(id);
    } catch (error) {
      console.error('Error hard deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Find conversations by user ID
   * @param userId - User ID
   * @returns Promise<Conversation[]>
   */
  public async findByUserId(userId: number): Promise<Conversation[]> {
    try {
      return await this.conversationRepository.findByUserId(userId);
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
      return await this.conversationRepository.findActiveByUserId(userId);
    } catch (error) {
      console.error('Error finding active conversations by user ID:', error);
      throw error;
    }
  }
}