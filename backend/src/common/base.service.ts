import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

/**
 * Base Service - Ortak servis metodları için base class
 * Yetki kontrolü ve entity bulma işlemlerini reusable hale getirir
 */
export abstract class BaseService<T extends { id: string; authorId?: string }> {
  constructor() {
    // Base constructor - child class'lar için gerekli
  }
  /**
   * Entity'nin sahibi olup olmadığını kontrol eder
   * User rolü için sahiplik kontrolü yapar, Admin/SuperAdmin için kontrol yapmaz
   */
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

  /**
   * Entity'yi bulur veya NotFoundException fırlatır
   */
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

