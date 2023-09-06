import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RequestWithUser } from '../common/interfaces/requestWithUser.interface';
import JwtAuthGuard from './guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmailDto } from '../common/dtos/email.dto';
import { VerifyEmailDto } from '../common/dtos/verifyEmail.dto';
import { LoggedInUserDto } from '../user/dto/loggedIn-user.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.authService.signupUser(createUserDto);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoggedInUserDto })
  async logIn(
    @Req() req: RequestWithUser,
  ): Promise<{ token: string; user: User }> {
    const { user } = req;
    const token = this.authService.getCookieWithJwtToken(user.id);
    return { token, user };
  }

  @Post('email/send')
  async initiateEmailAddressVerification(
    @Body() emailDto: EmailDto,
  ): Promise<boolean> {
    return await this.authService.initiateEmailAddressVerification(
      emailDto.email,
    );
  }

  @Post('email/check')
  async checkEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<boolean> {
    const { email, code } = verifyEmailDto;
    return await this.authService.confirmEmailVerification(email, code);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  authenticate(@Req() req: RequestWithUser) {
    const { user } = req;
    return user;
  }
}
