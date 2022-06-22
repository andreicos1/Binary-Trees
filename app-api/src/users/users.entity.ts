import { Exclude } from "class-transformer";
import { Heart } from "src/hearts/hearts.entity";
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

  @OneToMany(() => Heart, (heart) => heart.user)
  hearts: Heart[];
}
