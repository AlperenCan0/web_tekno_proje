import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Story } from './story.entity';

/**
 * Comment Entity - Hikayelere yapılan yorumları tutar
 * Many-to-One ilişki: User (author) ve Story ile
 */
@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: 0 })
  dislikes: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Many-to-One ilişki: Comment -> User (author)
  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  author: User;

  @Column()
  authorId: string;

  // Many-to-One ilişki: Comment -> Story
  @ManyToOne(() => Story, (story) => story.comments, { onDelete: 'CASCADE' })
  @JoinColumn()
  story: Story;

  @Column()
  storyId: string;
}

