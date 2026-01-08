import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

export abstract class BaseService<T extends { id: string; authorId?: string }> {
  constructor() {
  }

  protected checkOwnership(
    entity: T,
    userId: string,
    userRole: string,
    errorMessage: string = 'Bu işlemi yapma yetkiniz yok',
  ): void {
    if (userRole === 'User' && entity.authorId && entity.authorId !== userId) {
      throw new ForbiddenException(errorMessage);
    }
  }

  protected async findOneOrFail(
    repository: Repository<T>,
    id: string,
    entityName: string = 'Entity',
    relations?: string[],
  ): Promise<T> {
    const entity = await repository.findOne({
      where: { id } as any,
      relations,
    });

    if (!entity) {
      throw new NotFoundException(`ID ${id} ile ${entityName} bulunamadı`);
    }

    return entity;
  }
}
