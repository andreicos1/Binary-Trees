import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { View } from "./view.entity";

@Injectable()
export class ViewsService {
  constructor(@InjectRepository(View) private readonly repo: Repository<View>) {}

  getCount() {
    return this.repo.count();
  }

  async create(ip: string) {
    const oldView = await this.repo.find({ ip });
    if (ip && !oldView.length) {
      const viewedAt = new Date(Date.now());
      const view = this.repo.create({
        ip,
        viewedAt,
      });
      this.repo.save(view);
      return true;
    }
    return false;
  }
}
