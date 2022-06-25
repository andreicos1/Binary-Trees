import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/users/users.entity";

@Injectable()
export class EmailConfirmationGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const jwtToken = request.cookies["jwt"];
    const payload = this.jwtService.decode(jwtToken) as User;
    if (!payload) throw new UnauthorizedException("Not signed in");
    if (!payload["email"]) {
      throw new BadRequestException("Invalid token provided.");
    }
    if (!payload.isEmailConfirmed) {
      throw new UnauthorizedException("Please confirm your email first.");
    }
    return true;
  }
}
