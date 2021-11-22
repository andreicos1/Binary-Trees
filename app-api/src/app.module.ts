import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./users/users.entity";
import { UsersModule } from "./users/users.module";
import { MailModule } from "./mail/mail.module";
import { CommentsModule } from "./comments/comments.module";
import { Comment } from "./comments/comments.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [User, Comment],
      synchronize: true,
    }),
    UsersModule,
    MailModule,
    CommentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
