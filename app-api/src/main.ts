import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Config required to be able to retrieve user from cookie
  app.use(cookieParser());
  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });
  // Valdation DTO
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle("Binary Trees API")
    .setDescription("The binary trees API description")
    .setVersion("alpha_0.1")
    .addTag("binary trees")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);
  // await app.listen(process.env.PORT || 3001);
  await app.listen(80);
}
bootstrap();
