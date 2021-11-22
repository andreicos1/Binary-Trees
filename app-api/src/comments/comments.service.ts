import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/users/users.entity";
import { Repository } from "typeorm";
import { Comment } from "./comments.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly repo: Repository<Comment>
  ) {}

  create(content: string, user: User) {
    const postedAt = Date.now();
    const comment = this.repo.create({
      content,
      postedAt,
      user,
    });
    this.repo.save(comment);
  }
}
