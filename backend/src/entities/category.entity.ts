import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Story } from './story.entity';

/**
 * Category Entity - Hikaye kategorilerini tutar
 * Many-to-Many ilişki: Story ile
 */
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string; // Kategori ikonu URL'i

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many-to-Many ilişki: Category -> Story
  @ManyToMany(() => Story, (story) => story.categories)
  stories: Story[];
}

