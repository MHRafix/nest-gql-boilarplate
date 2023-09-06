import { AppPaginationResponse } from '@/src/shared/contracts/app-pagination-response';
import { SortType } from '@/src/shared/dto/CommonPaginationDto';
import { filterBuilder } from '@/src/shared/utils/filterBuilder';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { CommentListQueryDto } from './dto/comment-list-query.input';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment, CommentDocument } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
  ) {}

  async create(payload: CreateCommentInput) {
    await this.commentModel.create(payload);
    return true;
  }

  /**
   * get all comments
   * @param payload inputs
   * @param fields fields
   * @returns
   */
  async findAll(payload: CommentListQueryDto, fields: string[] = []) {
    const { page = 1, limit = 10 } = payload;
    const where = filterBuilder(payload.where, payload.whereOperator);

    const cursor = this.commentModel.find(where);

    // populate comment author info
    if (fields.includes('userId')) {
      cursor.populate({
        path: 'userId',
        model: User.name,
      });
    }

    // populate post details
    if (fields.includes('postId')) {
      cursor.populate({
        path: 'postId',
        model: Post.name,
      });
    }

    const count = await this.commentModel.countDocuments(where);
    const skip = (page - 1) * limit;
    const data = await cursor
      .sort({ [payload?.sortBy]: payload?.sort == SortType.DESC ? -1 : 1 })
      .skip(skip)
      .limit(limit);

    return new AppPaginationResponse(data, {
      totalCount: count,
      currentPage: page,
      hasNextPage: page * limit < count,
      totalPages: Math.ceil(count / limit),
    });
  }

  /**
   * get single comment
   * @param filter filter
   * @param fields fields
   * @returns
   */
  async findOne(filter: FilterQuery<CommentDocument>, fields: string[] = []) {
    try {
      const data = await this.commentModel.findOne(filter);

      if (!data) {
        throw new ForbiddenException('Comments is not found');
      }
      return data;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }

  update(id: string, updateCommentInput: UpdateCommentInput) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
