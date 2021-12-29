import { Controller, Get, Post, Request } from "@nestjs/common";
import { LikesService } from "./likes.service";

@Controller("likes")
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  async create(@Request() request): Promise<boolean> {
    return await this.likesService.create(request.ip);
  }

  @Get()
  getCount() {
    return this.likesService.getCount();
  }
}
