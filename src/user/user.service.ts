import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return user;
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async getUsers(): Promise<User[]> {
    const users = await this.usersRepository.find({
      relations: ['posts'],
    });
    return users;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });
    if (user) return user;
    throw new HttpException(
      'User with this email does not exist',
      HttpStatus.NOT_FOUND,
    );
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create(createUserDto);
    await this.usersRepository.save(newUser);
    return newUser;
  }
}
