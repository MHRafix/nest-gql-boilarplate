import { Field, ID, InputType } from '@nestjs/graphql';
import { IsArray, IsMongoId, IsNotEmpty, IsOptional } from 'class-validator';
import { POST_STATUS } from '../entities/post.entity';

@InputType()
export class CreatePostInput {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field(() => String)
  @IsNotEmpty()
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  description: string;

  @Field(() => POST_STATUS, {
    defaultValue: POST_STATUS.PUBLISHED,
    nullable: true,
  })
  @IsOptional()
  status: POST_STATUS;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  files: string[];

  @Field(() => String)
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsMongoId()
  shareFrom: string;
}
