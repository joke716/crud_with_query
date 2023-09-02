import { Column, Entity } from 'typeorm';
import { CommonEntity } from '../../common/entities/common.entity';

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
}
