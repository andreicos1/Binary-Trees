import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Like {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  likedAt: Date;
}
