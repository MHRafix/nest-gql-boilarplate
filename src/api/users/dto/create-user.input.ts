import { Field, ID, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { USER_ROLE } from '../entities/user.entity';

@InputType()
export class CreateUserInput {
  @Field(() => ID, { nullable: true })
  _id: string;

  @Field(() => String, { description: 'User name', nullable: true })
  @IsOptional()
  name: string;

  @Field(() => String, { description: 'User email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Field(() => USER_ROLE, { description: 'User role', nullable: true })
  @IsOptional()
  role: USER_ROLE.CUSTOMER;

  @Field(() => String, { description: 'User password' })
  @IsNotEmpty()
  password: string;

  @Field(() => String, { description: 'User avatar', nullable: true })
  @IsOptional()
  avatar: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  accessToken: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  phone: string;
}
