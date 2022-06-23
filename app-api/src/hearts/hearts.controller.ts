import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { EmailConfirmationGuard } from "src/guards/email-confirmation.guard";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { HeartsService } from "./hearts.service";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/hearts")
export class HeartsController {
  constructor(
    private readonly heartsService: HeartsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async getUser(@Req() request: Request) {
    this.heartsService.getTotal();
    const cookie = request.cookies["jwt"];
    const jwt = this.jwtService.decode(cookie) as User;
    const user = await this.usersService.findOne(jwt.id);
    if (!user) {
      throw new UnauthorizedException("Invalid user session.");
    }
    return user;
  }

  @Get()
  async getTotalHearts() {
    return this.heartsService.getTotal();
  }

  @Get("/me")
  @UseGuards(JwtAuthGuard)
  async getHasReacted(@Req() request: Request) {
    const user = await this.getUser(request);
    return await this.heartsService.getIsFavorited(user.id);
  }

  @Post()
  @UseGuards(EmailConfirmationGuard)
  async postHeart(@Req() request: Request) {
    const user = await this.getUser(request);
    return this.heartsService.create(user);
  }
}
