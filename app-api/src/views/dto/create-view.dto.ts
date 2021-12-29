import { IsIP } from "class-validator";

export class CreateViewDto {
  @IsIP()
  ip: string;
}
