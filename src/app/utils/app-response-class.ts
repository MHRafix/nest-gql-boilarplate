import { HttpStatus } from '@nestjs/common';

export interface IResponseConstructor {
  statusCode: HttpStatus;
  title?: string;
  message?: string;
  data?: any;
}

export default class AppResponse {
  public statusCode: HttpStatus;
  public title?: string;
  public message?: string;
  public data?: any;

  constructor({
    data,
    statusCode,
    message = undefined,
    title = undefined,
  }: IResponseConstructor) {
    this.message = message;
    this.title = title;
    this.statusCode = statusCode;
    this.data = data;
  }
}
