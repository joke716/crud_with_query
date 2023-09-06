import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { RedisModule } from './redis/redis.module';
import { AppconfigModule } from './appconfig/appconfig.module';
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    AppconfigModule,
    DatabaseModule,
    RedisModule,
    UserModule,
    AuthModule,
    EmailModule,
    PostModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
