import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  BlogPost,
  User,
} from '../models';
import {BlogPostRepository} from '../repositories';

export class BlogPostUserController {
  constructor(
    @repository(BlogPostRepository)
    public blogPostRepository: BlogPostRepository,
  ) { }

  @get('/blog-posts/{id}/user', {
    responses: {
      '200': {
        description: 'User belonging to BlogPost',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(User)},
          },
        },
      },
    },
  })
  async getUser(
    @param.path.string('id') id: typeof BlogPost.prototype.id,
  ): Promise<User> {
    return this.blogPostRepository.user(id);
  }
}
