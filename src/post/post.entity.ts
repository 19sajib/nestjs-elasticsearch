import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('post')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    post_by: string;

    @Column()
    tag: string;

    @Column()
    contact: string;
}