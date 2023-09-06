import { Field, ID, InputType } from '@nestjs/graphql';
import { IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  message: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  file: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
