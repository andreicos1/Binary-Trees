import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class View {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ip: string;

  @Column()
  viewedAt: Date;
}
