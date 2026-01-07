import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinColumn,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from './category.entity';
import { Comment } from './comment.entity';

/**
 * Story Entity - Yerel hikayeleri tutar
 * Many-to-One ilişki: User (author) ile
 * Many-to-Many ilişki: Category ile
 * One-to-Many ilişki: Comment ile
 */
@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column('decimal', { precision: 10, scale: 8, nullable: true })
  latitude: number; // Google Maps koordinatı - enlem

  @Column('decimal', { precision: 11, scale: 8, nullable: true })
  longitude: number; // Google Maps koordinatı - boylam

  @Column({ nullable: true })
  locationName: string; // Lokasyon adı (örn: "İstanbul, Kadıköy")

  @Column({ type: 'simple-array', nullable: true })
  photos: string[]; // Fotoğraf URL'leri dizisi

  @Column({ default: 0 })
  likes: number; // Beğeni sayısı

  @Column({ default: 0 })
  dislikes: number; // Beğenmeme sayısı

  @Column({ default: true })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many-to-One ilişki: Story -> User (author)
  @ManyToOne(() => User, (user) => user.stories, { onDelete: 'CASCADE' })
  @JoinColumn()
  author: User;

  @Column()
  authorId: string;

  // Many-to-Many ilişki: Story -> Category
  @ManyToMany(() => Category, (category) => category.stories)
  @JoinTable({
    name: 'story_categories',
    joinColumn: { name: 'storyId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories: Category[];

  // One-to-Many ilişki: Story -> Comment
  @OneToMany(() => Comment, (comment) => comment.story, { cascade: true })
  comments: Comment[];
}

