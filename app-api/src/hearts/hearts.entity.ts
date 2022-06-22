import { User } from "src/users/users.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Heart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.hearts)
  user: User;
}
