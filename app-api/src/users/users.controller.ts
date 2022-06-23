import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { ConfirmEmailDto } from "./dtos/confirm-email.dto";
import { CreateUserDto } from "./dtos/create-user.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { UsersService } from "./users.service";
import { EmailConfirmationGuard } from "src/guards/email-confirmation.guard";
import { request } from "http";

@UseInterceptors(ClassSerializerInterceptor)
@Controller("auth")
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private jwtService: JwtService
  ) {}

  @Post("/signup")
  async signup(@Body() body: CreateUserDto) {
    const user = await this.authService.signup(body.email, body.password);
    return user;
  }

  @Post("/confirm")
  async confirm(@Body() body: ConfirmEmailDto, @Res({ passthrough: true }) response: Response) {
    // Mark email as confirmed in the database
    try {
      const email: string = await this.authService.decodeConfirmationToken(body.token);
      // Get the user and create a new jwt token
      const user = (await this.usersService.find(email))[0];
      if (!user) {
        throw new NotFoundException("User not found");
      }
      this.authService.confirmEmail(user);
      const payload = {
        id: user.id,
        email: user.email,
        isEmailConfirmed: true,
      };
      const jwt = await this.jwtService.signAsync(payload);
      response.cookie("jwt", jwt, { httpOnly: true });
      return "Email Confirmed!";
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post("/login")
  async login(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true /* send to frontend */ }) response: Response
  ) {
    const user = await this.authService.login(body.email, body.password);
    const payload = { id: user.id, email: user.email, isEmailConfirmed: user.isEmailConfirmed };
    const jwt = await this.jwtService.signAsync(payload);
    response.cookie("jwt", jwt, { httpOnly: true });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post("/logout")
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const cookie = request.cookies["jwt"];
    if (!cookie) {
      throw new NotFoundException("No current session data found");
    }
    response.clearCookie("jwt");
    request.logout();
    return {
      message: "success",
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async user(@Req() request: Request) {
    try {
      const cookie = request.cookies["jwt"];
      const data = await this.jwtService.verifyAsync(cookie);
      if (!data) {
        throw new UnauthorizedException();
      }
      const user = await this.usersService.findOne(data.id);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post("/resend-confirmation")
  async resendConfirmation(@Req() request: Request) {
    try {
      const cookie = request.cookies["jwt"];
      const data = await this.jwtService.verifyAsync(cookie);
      const user = await this.usersService.findOne(data.id);
      await this.authService.resendConfirmation(user.email);
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(EmailConfirmationGuard)
  @Get("/:id")
  async findUser(@Param("id") id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }
}
