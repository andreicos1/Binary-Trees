import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { addBearer } from "./middlewares/addBearer";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Config required to be able to retrieve user from cookie
  app.use(cookieParser());
  // CORS
  var whitelist = process.env.CORS_WHITELIST.split(',')
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  });
  // Add Global Middleware
  app.use(addBearer);
  // Valdation DTO
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle("Binary Trees API")
    .setDescription("The binary trees API description")
    .setVersion("alpha_0.1")
    .addTag("binary trees")
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api-info", app, document);
  await app.listen(process.env.PORT);
}
bootstrap();
