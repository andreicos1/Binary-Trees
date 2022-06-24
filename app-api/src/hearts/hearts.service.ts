import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { Heart } from "./hearts.entity";

@Injectable()
export class HeartsService {
  constructor(@InjectRepository(Heart) private readonly repo: Repository<Heart>) {}

  getTotal() {
    return this.repo.createQueryBuilder("heart").getCount();
  }

  async getIsFavorited(userID: Number) {
    return (
      (
        await this.repo.find({
          where: { user: { id: userID } },
        })
      ).length > 0
    );
  }

  async create(user: User) {
    const createdAt = new Date(Date.now());
    const oldFavorites = await this.repo.find({
      where: { user: { id: user.id } },
    });
    if (oldFavorites.length) {
      this.repo.delete(oldFavorites[0]);
      return false;
    }
    const heart = this.repo.create({
      createdAt,
      user,
    });
    this.repo.save(heart);
    return true;
  }
}
