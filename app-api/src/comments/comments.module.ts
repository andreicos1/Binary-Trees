import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "src/users/users.module";
import { CommentsController } from "./comments.controller";
import { Comment } from "./comments.entity";
import { CommentsService } from "./comments.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UsersModule,
    JwtModule.register({
      secret: "secretKey",
      signOptions: { expiresIn: "1d" },
    }),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
