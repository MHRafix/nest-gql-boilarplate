import { AppPaginationResponse } from '@/src/shared/contracts/app-pagination-response';
import { SortType } from '@/src/shared/dto/CommonPaginationDto';
import { filterBuilder } from '@/src/shared/utils/filterBuilder';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { PostListQueryDto } from './dto/post-list-query-dto';
import { UpdatePostInput } from './dto/update-post.input';
import { Post, PostDocument } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name)
    private postModel: Model<PostDocument>,
  ) {}

  /**
   * create service
   * @param payload create payload
   * @returns
   */
  create(payload: CreatePostInput) {
    return this.postModel.create(payload);
  }

  /**
   * get all services
   * @param input inputs
   * @param fields fields
   * @returns
   */
  async findAll(input: PostListQueryDto, fields: string[] = []) {
    const { page = 1, limit = 10 } = input;
    const where = filterBuilder(input.where, input.whereOperator);

    const cursor = this.postModel.find(where);

    // populate post author info
    if (fields.includes('userId')) {
      cursor.populate({
        path: 'userId',
        model: User.name,
      });
    }

    // populate share from user info
    if (fields.includes('shareFrom')) {
      cursor.populate({
        path: 'shareFrom',
        model: User.name,
      });
    }

    const count = await this.postModel.countDocuments(where);
    const skip = (page - 1) * limit;
    const data = await cursor
      .sort({ [input?.sortBy]: input?.sort == SortType.DESC ? -1 : 1 })
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
   * get single service
   * @param filter filter
   * @param fields fields
   * @returns
   */
  async findOne(filter: FilterQuery<PostDocument>, fields: string[] = []) {
    try {
      const data = await this.postModel.findOne(filter);

      if (!data) {
        throw new ForbiddenException('Data is not found');
      }
      return data;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }

  /**
   * update service
   * @param _id service id
   * @param payload update payload
   * @returns
   */
  update(_id: string, payload: UpdatePostInput) {
    return this.postModel.findOneAndUpdate({ _id }, payload);
  }

  /**
   * delete service
   * @param filter filter
   * @returns
   */
  remove(filter: FilterQuery<PostDocument>) {
    return this.postModel.deleteOne(filter);
  }
}
