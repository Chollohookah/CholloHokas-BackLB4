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
import {Error} from '../models';
import {ErrorRepository} from '../repositories';

@authenticate('jwt')
export class ErrorController {
  constructor(
    @repository(ErrorRepository)
    public errorRepository: ErrorRepository,
  ) {}

  @post('/errors')
  @response(200, {
    description: 'Error model instance',
    content: {'application/json': {schema: getModelSchemaRef(Error)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Error, {
            title: 'NewError',
            exclude: ['id'],
          }),
        },
      },
    })
    error: Omit<Error, 'id'>,
  ): Promise<Error> {
    return this.errorRepository.create(error);
  }

  @get('/errors/count')
  @response(200, {
    description: 'Error model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Error) where?: Where<Error>): Promise<Count> {
    return this.errorRepository.count(where);
  }

  @get('/errors')
  @response(200, {
    description: 'Array of Error model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Error, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Error) filter?: Filter<Error>): Promise<Error[]> {
    return this.errorRepository.find(filter);
  }

  @patch('/errors')
  @response(200, {
    description: 'Error PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Error, {partial: true}),
        },
      },
    })
    error: Error,
    @param.where(Error) where?: Where<Error>,
  ): Promise<Count> {
    return this.errorRepository.updateAll(error, where);
  }

  @get('/errors/{id}')
  @response(200, {
    description: 'Error model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Error, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Error, {exclude: 'where'})
    filter?: FilterExcludingWhere<Error>,
  ): Promise<Error> {
    return this.errorRepository.findById(id, filter);
  }

  @patch('/errors/{id}')
  @response(204, {
    description: 'Error PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Error, {partial: true}),
        },
      },
    })
    error: Error,
  ): Promise<void> {
    await this.errorRepository.updateById(id, error);
  }

  @put('/errors/{id}')
  @response(204, {
    description: 'Error PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() error: Error,
  ): Promise<void> {
    await this.errorRepository.replaceById(id, error);
  }

  @del('/errors/{id}')
  @response(204, {
    description: 'Error DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.errorRepository.deleteById(id);
  }
}
