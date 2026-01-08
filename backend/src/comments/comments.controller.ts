import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { LikeCommentDto } from './dto/like-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yeni yorum oluşturur' })
  @ApiResponse({ status: 201, description: 'Yorum başarıyla oluşturuldu' })
  create(@Body() createCommentDto: CreateCommentDto, @CurrentUser() user: any) {
    return this.commentsService.create(createCommentDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm yorumları listeler' })
  @ApiQuery({ name: 'storyId', required: false, type: String, description: 'Hikaye ID\'sine göre filtrele' })
  @ApiResponse({ status: 200, description: 'Yorum listesi' })
  findAll(@Query('storyId') storyId?: string) {
    if (storyId) {
      return this.commentsService.findByStory(storyId);
    }
    return this.commentsService.findAll();
  }

  @Get(':id/like-status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Kullanıcının bu yoruma verdiği tepkiyi getirir' })
  @ApiResponse({ status: 200, description: 'Kullanıcının mevcut tepkisi (like/dislike/null)' })
  async getLikeStatus(@Param('id') id: string, @CurrentUser() user: any) {
    const action = await this.commentsService.getUserLikeStatus(id, user.id);
    return { userAction: action };
  }

  @Get(':id')
  @ApiOperation({ summary: 'ID\'ye göre yorum getirir' })
  @ApiResponse({ status: 200, description: 'Yorum detayları' })
  @ApiResponse({ status: 404, description: 'Yorum bulunamadı' })
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yorum bilgilerini günceller' })
  @ApiResponse({ status: 200, description: 'Yorum başarıyla güncellendi' })
  @ApiResponse({ status: 403, description: 'Bu yorumu güncelleme yetkiniz yok' })
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.update(id, updateCommentDto, user.id, user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yorumu siler' })
  @ApiResponse({ status: 200, description: 'Yorum başarıyla silindi' })
  @ApiResponse({ status: 403, description: 'Bu yorumu silme yetkiniz yok' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.commentsService.remove(id, user.id, user.role);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Yorumu beğenir veya beğenmez' })
  @ApiResponse({ status: 200, description: 'Beğeni işlemi başarılı' })
  @ApiResponse({ status: 400, description: 'Bu yorumu zaten beğendiniz/beğenmediniz' })
  likeComment(
    @Param('id') id: string,
    @Body() likeCommentDto: LikeCommentDto,
    @CurrentUser() user: any,
  ) {
    return this.commentsService.likeComment(id, likeCommentDto, user.id);
  }
}
