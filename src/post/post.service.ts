import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchService } from 'src/search/search.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly searchService: SearchService
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    const post = this.postRepository.create(createPostDto);
    const savedPost = await this.postRepository.save(post);
    this.searchService.indexPost(createPostDto, savedPost?.id)
    return savedPost
  }

  async findAll(): Promise<any> {
    return await this.searchService.searchAllPost()
    // return this.postRepository.find();
  }

  async findOne(id: number): Promise<any> {
    let post: any = await this.searchService.searchPostById(id.toString())
    if (post) return post?._source
    else return this.postRepository.findOneBy({ id });
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postRepository.update(id, updatePostDto);
    await this.searchService.updatePostById(id.toString(), updatePostDto)
    return this.findOne(id);
  }

  async remove(id: number): Promise<string> {
    await this.postRepository.delete(id);
    await this.searchService.deleteSingleDoc(id.toString())
    return "post deleted successfully"
  }

  async removeAll(): Promise<string> {
    await this.searchService.deleteAllDoc()
    return "All post removed from elastic db...."
  }

  async findPosts(search: string): Promise<any> {
    console.log(search, "hereeeeeeeeeeeeee")
    return await this.searchService.findPosts(search)
  }
}
