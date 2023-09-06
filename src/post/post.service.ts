import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async getAllPosts(): Promise<Post[]> {
    // return await this.postRepository.find();
    return await this.postRepository.find({
      relations: ['author'], // 'author' 관계를 로드하도록 설정합니다.
    });
  }

  async getPostById(id: string): Promise<Post> {
    // const post = await this.postRepository.findOneBy({ id });
    const post = await this.postRepository
      .createQueryBuilder('post') // 'post'는 별칭(alias)입니다.
      .leftJoinAndSelect('post.author', 'author') // 'author'는 User 엔티티에 대한 관계 이름입니다.
      .where('post.id = :id', { id })
      .getOne();

    if (post) return post;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async createPost(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const newPost = await this.postRepository.create({
      ...createPostDto,
      author: user,
    });
    await this.postRepository.save(newPost);
    return newPost;
  }

  async updatePost(id: string, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);

    // 업데이트된 포스트를 다시 가져옵니다.
    const updatedPost = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .leftJoinAndSelect('post.author', 'author') // 관계형 데이터를 함께 가져옵니다.
      .getOne();

    // 업데이트된 포스트가 존재하는지 확인합니다.
    if (updatedPost) return updatedPost;
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);

    // const updatedPost = await this.postRepository.findOne(id);
    // if (updatedPost) return updatedPost;
    // throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async deletePost(id: string): Promise<void> {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
