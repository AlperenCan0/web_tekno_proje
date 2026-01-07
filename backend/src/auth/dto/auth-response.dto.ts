import { ApiProperty } from '@nestjs/swagger';

/**
 * Auth response DTO'su
 * Login ve Register endpoint'lerinden dönen token ve kullanıcı bilgileri
 */
export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ example: 'user-id-uuid', description: 'Kullanıcı ID' })
  userId: string;

  @ApiProperty({ example: 'johndoe', description: 'Kullanıcı adı' })
  username: string;

  @ApiProperty({ example: 'User', enum: ['User', 'Admin', 'SuperAdmin'], description: 'Kullanıcı rolü' })
  role: 'User' | 'Admin' | 'SuperAdmin';
}

