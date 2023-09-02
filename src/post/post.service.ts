import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getAllPosts() {
    return await this.postRepository.find();
  }

  async getPostById(id: string) {
    const post = await this.postRepository.findOneBy({ id });
    if (post) return post;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(createPostDto: CreatePostDto) {
    const newPost = await this.postRepository.create(createPostDto);
    await this.postRepository.save(newPost);
    return newPost;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    const updatedPost = await this.postRepository.findOneBy({ id });
    if (updatedPost) return updatedPost;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: string) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
