import { Paginated } from '@/src/shared/object-types/paginationObject';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Post } from '../../posts/entities/post.entity';
import { User } from '../../users/entities/user.entity';

export type CommentDocument = Comment & Document;

@ObjectType()
@Schema({
  timestamps: true,
})
export class Comment {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Prop()
  @Field(() => String)
  message: string;

  @Prop()
  @Field(() => String)
  file: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Field(() => User)
  userId: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Post.name })
  @Field(() => Post)
  postId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

@ObjectType()
export class CommentPagination extends Paginated(Comment) {}
