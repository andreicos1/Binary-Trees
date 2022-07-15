import { IsBoolean } from "class-validator";

export class CreateLikeDto {
  @IsBoolean()
  liked: boolean;
}
