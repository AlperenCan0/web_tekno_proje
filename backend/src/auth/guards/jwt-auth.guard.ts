import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JWT Auth Guard - JWT token ile korumalı endpoint'ler için kullanılır
 * Bearer token ile gelen istekleri doğrular
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

