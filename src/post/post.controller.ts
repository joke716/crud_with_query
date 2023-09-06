import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { FindOneParams } from '../utils/findOneParams';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import { ApiTags } from '@nestjs/swagger';

@Controller('post')
@ApiTags('Post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ) {
    const { user } = req;
    return this.postService.createPost(createPostDto, user);
  }

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postService.getPostById(id);
  }

  @Patch(':id')
  async updatePost(
    @Param() { id }: FindOneParams,
    @Body() post: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, post);
  }

  @Delete(':id')
  async deletePost(@Param() { id }: FindOneParams) {
    return this.postService.deletePost(id);
  }
}
