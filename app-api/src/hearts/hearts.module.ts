import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { HeartsController } from "./hearts.controller";
import { Heart } from "./hearts.entity";
import { HeartsService } from "./hearts.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Heart]),
    UsersModule,
    JwtModule.register({
      secret: "secretKey",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [HeartsController],
  providers: [HeartsService],
})
export class HeartsModule {}
