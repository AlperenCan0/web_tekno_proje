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
import { Story } from './story.entity';

/**
 * StoryLike Entity - Hikaye beğenilerini kullanıcı bazında takip eder
 * Her kullanıcı bir hikayeyi sadece bir kez beğenebilir/beğenmeyebilir
 * Unique constraint ile çoklu like/dislike engellenir
 */
@Entity('story_likes')
@Unique(['userId', 'storyId']) // Bir kullanıcı bir hikayeye sadece bir kez tepki verebilir
export class StoryLike {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    storyId: string;

    @Column({ type: 'varchar', length: 10 })
    action: 'like' | 'dislike';

    @CreateDateColumn()
    createdAt: Date;

    // Many-to-One ilişki: StoryLike -> User
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    // Many-to-One ilişki: StoryLike -> Story
    @ManyToOne(() => Story, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'storyId' })
    story: Story;
}
