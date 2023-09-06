import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { LocalAuthStrategy } from './strategies/local-auth.strategy';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategies/jwt-accessToken.strategy';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.register({}),
    UserModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalAuthStrategy, JwtAccessTokenStrategy],
})
export class AuthModule {}
