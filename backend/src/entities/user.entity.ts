import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { Story } from './story.entity';
import { Comment } from './comment.entity';

/**
 * User Entity - Kullanıcı temel bilgilerini tutar
 * One-to-One ilişki: Profile ile
 * One-to-Many ilişki: Story ve Comment ile
 */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  username: string;

  @Column()
  password: string; // bcrypt ile hash'lenecek

  @Column({
    type: 'varchar',
    length: 20,
    default: 'User',
  })
  role: 'User' | 'Admin' | 'SuperAdmin';

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // One-to-One ilişki: User -> Profile
  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile: Profile;

  // One-to-Many ilişki: User -> Story
  @OneToMany(() => Story, (story) => story.author)
  stories: Story[];

  // One-to-Many ilişki: User -> Comment
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];
}

