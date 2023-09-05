import { AppPaginationResponse } from '@/src/shared/contracts/app-pagination-response';
import { SortType } from '@/src/shared/dto/CommonPaginationDto';
import { filterBuilder } from '@/src/shared/utils/filterBuilder';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  /**
   * signup user
   * @param input payload
   * @returns
   */

  async signup(input: CreateUserInput) {
    const email = input?.email;
    const isUserExist = await this.userModel.findOne({ email });

    if (isUserExist) {
      throw new BadRequestException(
        'This Email Already Used try with another email!',
      );
    }

    input.password = bcrypt.hashSync(input.password, 10);
    const newUser = await this.userModel.create(input);

    // make token and return
    const token = this.jwtService.sign({
      id: newUser._id,
      email: newUser?.email,
    });
    // return { userId: isUserExist?._id, token };

    newUser.accessToken = token;
    return newUser;
  }

  async signin(payload: CreateUserInput) {
    const { email, password } = payload;

    // check is user exist
    const isUserExist = await this.userModel.findOne({ email });

    // if user is not exist
    if (!isUserExist) {
      throw new UnauthorizedException('Email is not correct!');
    }

    // check is password matched
    const isMatchedPass = await bcrypt.compare(password, isUserExist.password);

    // if password is incorrect
    if (!isMatchedPass) {
      throw new UnauthorizedException('You entered wrong password!');
    }

    // make token and return
    const token = this.jwtService.sign({
      id: isUserExist._id,
      email: isUserExist?.email,
    });

    // return { userId: isUserExist?._id, token };

    isUserExist.accessToken = token;
    return isUserExist;
  }

  async adminSignin(payload: CreateUserInput) {
    const { email, password } = payload;

    // check is user exist
    const isUserExist = await this.userModel.findOne({ email });

    // if user is not exist
    if (!isUserExist) {
      throw new UnauthorizedException('Email is not correct!');
    }

    // check is password matched
    const isMatchedPass = await bcrypt.compare(password, isUserExist.password);

    // if password is incorrect
    if (!isMatchedPass) {
      throw new UnauthorizedException('You entered wrong password!');
    }

    if (isUserExist?.role !== 'ADMIN') {
      throw new UnauthorizedException('Access cancelled!');
    }

    // make token and return
    const token = this.jwtService.sign({
      id: isUserExist._id,
      email: isUserExist?.email,
      role: isUserExist?.role,
    });

    isUserExist.accessToken = token;
    return isUserExist;
  }

  /**
   * get all users
   * @returns
   */
  async findAll(input: UserListQueryDto, fields: string[] = []) {
    const { page = 1, limit = 10 } = input;
    const where = filterBuilder(input.where, input.whereOperator);

    const cursor = this.userModel.find(where);
    const count = await this.userModel.countDocuments(where);
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
   * get single user
   * @param _id single user id
   * @returns
   */
  async findOne(filter: FilterQuery<UserDocument>, fields: string[] = []) {
    try {
      const data = await this.userModel.findOne(filter);

      if (!data) {
        throw new ForbiddenException('Data is not found');
      }
      return data;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }

  /**
   * check user isAdmin
   * @param _id check user isAdmin
   * @returns
   */
  async isAdmin(email: string) {
    try {
      const data = await this.userModel.findOne({ email });

      if (data?.role !== 'ADMIN') {
        throw new UnauthorizedException(
          'You do not have permission to access this',
        );
      }
      return data;
    } catch (err) {
      throw new ForbiddenException(err.message);
    }
  }

  /**
   * update user
   * @param _id user id
   * @param input update payload
   * @returns
   */
  update(_id: string, updateUserInput: UpdateUserInput) {
    return this.userModel.findOneAndUpdate({ _id }, updateUserInput);
  }

  /**
   * delete user
   * @param filter
   * @returns
   */
  remove(filter: FilterQuery<UserDocument>) {
    return this.userModel.deleteOne(filter);
  }

  /**
   * remove many users
   * @param uids string[]
   * @returns
   */
  removeBulk(uids: string[]) {
    return this.userModel.deleteMany({
      _id: { $in: uids },
    });
  }
}
