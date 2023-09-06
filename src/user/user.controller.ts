import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.getUsers();
  }
}
