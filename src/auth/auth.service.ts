import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { PostgresErrorCode } from '../database/postgresErrorCode.enum';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../common/interfaces/tokenPayload.interface';
import { EmailService } from '../email/email.service';
import { CACHE_MANAGER } from '@nestjs/common/cache';
import { Cache } from 'cache-manager';
import { LoggedInUserDto } from '../user/dto/loggedIn-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async signupUser(createUserDto: CreateUserDto) {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async getAuthenticatedUser(loggedInUserDto: LoggedInUserDto) {
    try {
      const user = await this.userService.getUserByEmail(loggedInUserDto.email);
      const isPasswordMatching = await user.checkPassword(
        loggedInUserDto.password,
      );
      if (!isPasswordMatching) {
        throw new HttpException(
          'Wrong credentials provided',
          HttpStatus.BAD_REQUEST,
        );
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESSTOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_ACCESSTOKEN_EXPIRATION_TIME',
      )}m`,
    });
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    return token;
  }

  async initiateEmailAddressVerification(email: string): Promise<boolean> {
    const generateNumber = this.generateOTP();
    await this.cacheManager.set(email, generateNumber);
    await this.emailService.sendMail({
      to: email,
      subject: 'Verification Email Address - MiHyuns Blog',
      text: `The confirmation number is as follows. ${generateNumber}`,
    });
    return true;
  }

  async confirmEmailVerification(
    email: string,
    code: string,
  ): Promise<boolean> {
    const emailCodeByRedis = await this.cacheManager.get(email);
    if (emailCodeByRedis !== code) {
      throw new BadRequestException('Wrong code provided');
    }
    await this.cacheManager.del(email);
    return true;
  }

  generateOTP() {
    let OTP = '';
    for (let i = 1; i <= 6; i++) {
      OTP += Math.floor(Math.random() * 10);
    }
    return OTP;
  }
}
