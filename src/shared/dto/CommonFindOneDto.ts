import { Field, InputType, registerEnumType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

export enum MatchOperator {
  eq = 'eq',
  ne = 'ne',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  in = 'in',
  nin = 'nin',
  exists = 'exists',
  contains = 'contains',
}

registerEnumType(MatchOperator, {
  name: 'MatchOperator',
});

@InputType()
export class CommonMatchInput {
  @Field(() => String)
  @IsNotEmpty()
  key: string;

  @Field(() => MatchOperator)
  @IsNotEmpty()
  operator: MatchOperator;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  value: string;
}
