import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MailService } from "./mail.service";

@Module({
  imports: [
    JwtModule.register({
      secret: "secretKey",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
