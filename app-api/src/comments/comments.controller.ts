import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { EmailConfirmationGuard } from "src/guards/email-confirmation.guard";
import { User } from "src/users/users.entity";
import { UsersService } from "src/users/users.service";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dtos/create-comment.dto";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("/comments")
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  @Post()
  @UseGuards(EmailConfirmationGuard)
  async postComment(
    @Body() comment: CreateCommentDto,
    @Req() request: Request
  ) {
    const cookie = request.cookies["jwt"];
    const jwt = this.jwtService.decode(cookie) as User;
    if (!jwt || !jwt.isEmailConfirmed) {
      throw new UnauthorizedException(
        "Only logged in users with a confirmed email address can comment."
      );
    }
    const user = await this.usersService.findOne(jwt.id);
    if (!user) {
      throw new UnauthorizedException("Invalid user session.");
    }
    this.commentsService.create(comment.content, user);
    return comment;
  }
}
