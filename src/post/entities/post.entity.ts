import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';
import { User } from '../../user/entities/user.entity';

@Entity('posts')
export class Post extends CommonEntity {
  @Column({ unique: true })
  title: string;

  @Column()
  content: string;

  @Column()
  category: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;
}
