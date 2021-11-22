import { Expose, Transform } from "class-transformer";

export class CommentDto {
  @Expose()
  content: string;
  @Expose()
  postedAt: Date;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
