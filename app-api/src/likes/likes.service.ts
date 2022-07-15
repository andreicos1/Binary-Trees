import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Like } from "./like.entity";

@Injectable()
export class LikesService {
  constructor(@InjectRepository(Like) private readonly repo: Repository<Like>) {}

  getCount() {
    return this.repo.count();
  }

  async create(ip: string, liked: boolean) {
    if (!ip) {
      return false;
    }
    const oldLike = await this.repo.findOne({ ip });
    if (liked) {
      if (oldLike) return true;
      const likedAt = new Date(Date.now());
      const like = this.repo.create({
        ip,
        likedAt,
      });
      this.repo.save(like);
      return true;
    }
    if (!oldLike) return false;
    this.repo.delete(oldLike);
    return false;
  }

  async findOneIp(ip: string) {
    const like = await this.repo.findOne({ ip });
    return Boolean(like);
  }
}
