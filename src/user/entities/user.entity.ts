import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { Exclude } from 'class-transformer';
import { Role } from './role.enum';
import { InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as gravatar from 'gravatar';

@Entity()
export class User extends CommonEntity {
  @Column({ unique: true })
  public userId: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public username: string;

  @Column({ nullable: true })
  @Exclude()
  public password?: string;

  @Column({ nullable: true })
  public profileImg?: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.USER],
  })
  public roles: Role[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      let generatedNumber = '';
      for (let i = 1; i <= 6; i++) {
        generatedNumber += Math.floor(Math.random() * 10);
      }
      this.userId = generatedNumber;
      // if (this.provider !== Provider.LOCAL) {
      //   return;
      // } else {
      // generate number of UserId

      //프로필 이미지 자동생성
      this.profileImg = gravatar.url(this.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
        protocol: 'https',
      });

      // 패스워드 암호화
      const saltValue = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, saltValue);
      // }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }
}
