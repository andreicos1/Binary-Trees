import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./users.entity";

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  findOne(id: number): Promise<User | undefined> {
    if (!id) return null;
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async markEmailAsConfirmed(email: string) {
    return this.repo.update(
      { email },
      {
        isEmailConfirmed: true,
      }
    );
  }
}