import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import PostsService from './posts.service';
import { CreatePostDto } from './dto/createPost.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { FindOneParams } from 'src/utils/findOneParams';

@Controller('posts')
export default class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getAllPosts() {
    return this.postsService.getAllPosts();
  }

  @Get(':id')
  getPostById(@Param() { id }: FindOneParams) {
    return this.postsService.getPostById(Number(id));
  }

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async createPost(@Body() post: CreatePostDto) {
    return this.postsService.createPost(post);
  }
}
