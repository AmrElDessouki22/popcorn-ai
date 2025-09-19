import { Repository, DataSource, ObjectLiteral, DeepPartial } from 'typeorm';

export abstract class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;
  protected dataSource: DataSource;

  constructor(dataSource: DataSource, entity: new () => T) {
    this.dataSource = dataSource;
    this.repository = dataSource.getRepository(entity);
  }

  public async findById(id: number, includeDeleted: boolean = false): Promise<T | null> {
    const queryBuilder = this.repository.createQueryBuilder('entity')
      .where('entity.id = :id', { id });
    
    if (!includeDeleted) {
      queryBuilder.andWhere('entity.deletedAt IS NULL');
    }
    
    return await queryBuilder.getOne();
  }

  public async findAll(includeDeleted: boolean = false): Promise<T[]> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    
    if (!includeDeleted) {
      queryBuilder.where('entity.deletedAt IS NULL');
    }
    
    return await queryBuilder.getMany();
  }

  public async create(entity: Partial<T>): Promise<T> {
    const newEntity = this.repository.create(entity as DeepPartial<T>);
    const saved = await this.repository.save(newEntity);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  public async update(id: number, entity: Partial<T>): Promise<T | null> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await this.repository.update(id, entity as any);
    return await this.findById(id);
  }

  public async softDelete(id: number): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await this.repository.update(id, { deletedAt: new Date() } as any);
    return (result.affected ?? 0) > 0;
  }

  public async hardDelete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  public async restore(id: number): Promise<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await this.repository.update(id, { deletedAt: null } as any);
    return (result.affected ?? 0) > 0;
  }

  public async findOne(filter: Partial<T>, includeDeleted: boolean = false): Promise<T | null> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    
    Object.keys(filter).forEach((key, index) => {
      if (index === 0) {
        queryBuilder.where(`entity.${key} = :${key}`, { [key]: filter[key as keyof T] });
      } else {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: filter[key as keyof T] });
      }
    });
    
    if (!includeDeleted) {
      queryBuilder.andWhere('entity.deletedAt IS NULL');
    }
    
    return await queryBuilder.getOne();
  }

  public async findMany(filter: Partial<T>, includeDeleted: boolean = false): Promise<T[]> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    
    Object.keys(filter).forEach((key, index) => {
      if (index === 0) {
        queryBuilder.where(`entity.${key} = :${key}`, { [key]: filter[key as keyof T] });
      } else {
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: filter[key as keyof T] });
      }
    });
    
    if (!includeDeleted) {
      queryBuilder.andWhere('entity.deletedAt IS NULL');
    }
    
    return await queryBuilder.getMany();
  }

  public async count(filter?: Partial<T>, includeDeleted: boolean = false): Promise<number> {
    const queryBuilder = this.repository.createQueryBuilder('entity');
    
    if (filter) {
      Object.keys(filter).forEach((key, index) => {
        if (index === 0) {
          queryBuilder.where(`entity.${key} = :${key}`, { [key]: filter[key as keyof T] });
        } else {
          queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: filter[key as keyof T] });
        }
      });
    }
    
    if (!includeDeleted) {
      queryBuilder.andWhere('entity.deletedAt IS NULL');
    }
    
    return await queryBuilder.getCount();
  }

  public async exists(filter: Partial<T>, includeDeleted: boolean = false): Promise<boolean> {
    const count = await this.count(filter, includeDeleted);
    return count > 0;
  }

  public async findDeleted(): Promise<T[]> {
    return await this.repository.createQueryBuilder('entity')
      .where('entity.deletedAt IS NOT NULL')
      .getMany();
  }

  public async findByIdWithDeleted(id: number): Promise<T | null> {
    return await this.findById(id, true);
  }
}