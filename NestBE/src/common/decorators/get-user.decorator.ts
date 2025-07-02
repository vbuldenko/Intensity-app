import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface User {
  // Define the properties of your User entity here
  id: string;
  email: string;
  // Add other properties as needed
}

export interface RequestWithUser extends Request {
  user: User;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
