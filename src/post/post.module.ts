import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { SearchModule } from 'src/search/search.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), SearchModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
