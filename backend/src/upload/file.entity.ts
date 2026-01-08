import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('files')
export class FileEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    filename: string;

    @Column()
    originalName: string;

    @Column()
    mimetype: string;

    @Column('bytea')
    data: Buffer;

    @Column()
    size: number;

    @CreateDateColumn()
    createdAt: Date;
}
