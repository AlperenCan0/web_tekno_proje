import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Current User Decorator - Request'ten mevcut kullanıcıyı çıkarmak için kullanılır
 * @param data - İstenen kullanıcı özelliği (opsiyonel)
 * @param ctx - Execution context
 * Örnek: @CurrentUser() user veya @CurrentUser('id') userId
 */
export const CurrentUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

