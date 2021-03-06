import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { MailService } from "src/mail/mail.service";
import { User } from "./users.entity";
import * as bcrypt from "bcrypt";

import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private jwtService: JwtService
  ) {}

  async signup(email: string, password: string) {
    const existingUser = await this.usersService.find(email);
    if (existingUser.length) {
      throw new BadRequestException("email in use");
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await this.usersService.create(email, hashedPassword);
    await this.mailService.sendConfirmationMail(email);
    return user;
  }

  async confirmEmail(user: User) {
    if (user.isEmailConfirmed) {
      throw new BadRequestException("Email is already confirmed.");
    }
    await this.usersService.markEmailAsConfirmed(user.email);
    return "Email successfully confirmed";
  }

  decodeConfirmationToken(token: string) {
    try {
      const payload = this.jwtService.decode(token);
      if (typeof payload === "object" && payload.hasOwnProperty("email")) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === "TokenExpiredError") {
        throw new BadRequestException("Email confirmation token expired");
      }
      throw new BadRequestException("Bad confirmation token");
    }
  }

  async login(email: string, password: string) {
    const user = (await this.usersService.find(email))[0];
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadGatewayException("Incorrect password");
    }
    return user;
  }

  async resendConfirmation(email: string) {
    await this.mailService.sendConfirmationMail(email);
  }

  async sendPasswordResetEmail(email: string) {
    await this.mailService.sendPasswordResetEmail(email);
  }

  async resetPassword(id: number, password: string) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    this.usersService.resetPassword(id, hashedPassword);
  }
}
