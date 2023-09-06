import { Paginated } from '@/src/shared/object-types/paginationObject';
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';

export type PostDocument = Post & Document;

export enum POST_STATUS {
  PUBLISHED = 'PUBLISHED',
  BLOCKED = 'BLOCKED',
}

registerEnumType(POST_STATUS, {
  name: 'POST_STATUS',
});

@ObjectType()
@Schema({ timestamps: true })
export class Post {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Prop()
  @Field(() => String)
  title: string;

  @Prop()
  @Field(() => String, { nullable: true })
  description: string;

  @Prop({
    default: POST_STATUS.PUBLISHED,
  })
  @Field(() => POST_STATUS, {
    defaultValue: POST_STATUS.PUBLISHED,
    nullable: true,
  })
  status: POST_STATUS;

  @Prop()
  @Field(() => [String], { nullable: true })
  files: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User, { nullable: true })
  shareFrom: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);

@ObjectType()
export class PostPagination extends Paginated(Post) {}
