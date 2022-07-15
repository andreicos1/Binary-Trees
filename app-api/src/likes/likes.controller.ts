import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { CreateLikeDto } from "./dto/create-like.dto";
import { LikesService } from "./likes.service";

@Controller("likes")
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  create(@Request() request, @Body() body: CreateLikeDto) {
    return this.likesService.create(request.ip, body.liked);
  }

  @Get()
  getCount() {
    return this.likesService.getCount();
  }

  @Get("ip")
  findOneIp(@Request() request) {
    return this.likesService.findOneIp(request.ip);
  }
}
