import { Exclude } from "class-transformer";
import { Comment } from "src/comments/comments.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column("boolean", { default: false })
  isEmailConfirmed: boolean = false;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
