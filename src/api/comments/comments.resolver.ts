import { CommonMatchInput } from '@/src/shared/dto/CommonFindOneDto';
import { mongodbFindObjectBuilder } from '@/src/shared/utils/filterBuilder';
import getGqlFields from '@/src/shared/utils/get-gql-fields';
import { BadRequestException } from '@nestjs/common';
import { Args, Info, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostListQueryDto } from '../posts/dto/post-list-query-dto';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment, CommentPagination } from './entities/comment.entity';

@Resolver(() => Comment)
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Mutation(() => Boolean)
  // @UseGuards(GqlAuthGuard)
  async createComment(@Args('payload') payload: CreateCommentInput) {
    return this.commentsService.create(payload);
  }

  @Query(() => CommentPagination, { name: 'comments' })
  findAll(
    @Args('payload', { nullable: true }) payload: PostListQueryDto,
    @Info() info: any,
  ) {
    try {
      const fields = getGqlFields(info, 'nodes');
      return this.commentsService.findAll(payload, fields);
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }

  @Query(() => Comment, { name: 'comment' })
  findOne(@Args('payload') payload: CommonMatchInput) {
    try {
      const find = mongodbFindObjectBuilder(payload);
      return this.commentsService.findOne(find);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Mutation(() => Comment)
  updateComment(
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ) {
    return this.commentsService.update(
      updateCommentInput._id,
      updateCommentInput,
    );
  }

  @Mutation(() => Comment)
  removeComment(@Args('id', { type: () => Int }) id: number) {
    return this.commentsService.remove(id);
  }
}
