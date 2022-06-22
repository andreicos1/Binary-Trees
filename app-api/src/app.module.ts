import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User } from "./users/users.entity";
import { UsersModule } from "./users/users.module";
import { MailModule } from "./mail/mail.module";
import { HeartsModule } from "./hearts/hearts.module";
import { Heart } from "./hearts/hearts.entity";
import { ViewsModule } from "./views/views.module";
import { View } from "./views/view.entity";
import { LikesModule } from "./likes/likes.module";
import { Like } from "./likes/like.entity";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "db.sqlite",
      entities: [User, Heart, View, Like],
      synchronize: true,
    }),
    UsersModule,
    MailModule,
    HeartsModule,
    ViewsModule,
    LikesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
