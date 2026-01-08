import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Comment } from './comment.entity';

/**
 * CommentLike Entity - Yorum beğenilerini kullanıcı bazında takip eder
 * Her kullanıcı bir yorumu sadece bir kez beğenebilir/beğenmeyebilir
 * Unique constraint ile çoklu like/dislike engellenir
 */
@Entity('comment_likes')
@Unique(['userId', 'commentId']) // Bir kullanıcı bir yoruma sadece bir kez tepki verebilir
export class CommentLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  commentId: string;

  @Column({ type: 'varchar', length: 10 })
  action: 'like' | 'dislike';

  @CreateDateColumn()
  createdAt: Date;

  // Many-to-One ilişki: CommentLike -> User
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  // Many-to-One ilişki: CommentLike -> Comment
  @ManyToOne(() => Comment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;
}

