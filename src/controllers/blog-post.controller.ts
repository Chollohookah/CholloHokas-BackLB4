import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {BlogPost} from '../models';
import {BlogPostRepository} from '../repositories';

@authenticate('jwt')
export class BlogPostController {
  constructor(
    @repository(BlogPostRepository)
    public blogPostRepository: BlogPostRepository,
  ) {}

  @post('/blog-posts')
  @response(200, {
    description: 'BlogPost model instance',
    content: {'application/json': {schema: getModelSchemaRef(BlogPost)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogPost, {
            title: 'NewBlogPost',
            exclude: ['id'],
          }),
        },
      },
    })
    blogPost: Omit<BlogPost, 'id'>,
  ): Promise<BlogPost> {
    return this.blogPostRepository.create(blogPost);
  }

  @get('/blog-posts/count')
  @response(200, {
    description: 'BlogPost model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(BlogPost) where?: Where<BlogPost>): Promise<Count> {
    return this.blogPostRepository.count(where);
  }

  @get('/blog-posts')
  @response(200, {
    description: 'Array of BlogPost model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(BlogPost, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(BlogPost) filter?: Filter<BlogPost>,
  ): Promise<BlogPost[]> {
    return this.blogPostRepository.find(filter);
  }

  @patch('/blog-posts')
  @response(200, {
    description: 'BlogPost PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogPost, {partial: true}),
        },
      },
    })
    blogPost: BlogPost,
    @param.where(BlogPost) where?: Where<BlogPost>,
  ): Promise<Count> {
    return this.blogPostRepository.updateAll(blogPost, where);
  }

  @get('/blog-posts/{id}')
  @response(200, {
    description: 'BlogPost model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(BlogPost, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(BlogPost, {exclude: 'where'})
    filter?: FilterExcludingWhere<BlogPost>,
  ): Promise<BlogPost> {
    return this.blogPostRepository.findById(id, filter);
  }

  @patch('/blog-posts/{id}')
  @response(204, {
    description: 'BlogPost PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BlogPost, {partial: true}),
        },
      },
    })
    blogPost: BlogPost,
  ): Promise<void> {
    await this.blogPostRepository.updateById(id, blogPost);
  }

  @put('/blog-posts/{id}')
  @response(204, {
    description: 'BlogPost PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() blogPost: BlogPost,
  ): Promise<void> {
    await this.blogPostRepository.replaceById(id, blogPost);
  }

  @del('/blog-posts/{id}')
  @response(204, {
    description: 'BlogPost DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.blogPostRepository.deleteById(id);
  }
}
