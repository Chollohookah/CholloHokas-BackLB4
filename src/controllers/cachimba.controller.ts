import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {CachimbaModel} from '../models';
import {CachimbaModelRepository} from '../repositories';

export class CachimbaController {
  constructor(
    @repository(CachimbaModelRepository)
    public cachimbaModelRepository : CachimbaModelRepository,
  ) {}

  @post('/cachimba-models', {
    responses: {
      '200': {
        description: 'CachimbaModel model instance',
        content: {'application/json': {schema: getModelSchemaRef(CachimbaModel)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CachimbaModel, {
            title: 'NewCachimbaModel',
            exclude: ['id'],
          }),
        },
      },
    })
    cachimbaModel: Omit<CachimbaModel, 'id'>,
  ): Promise<CachimbaModel> {
    return this.cachimbaModelRepository.create(cachimbaModel);
  }

  @get('/cachimba-models/count', {
    responses: {
      '200': {
        description: 'CachimbaModel model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(CachimbaModel) where?: Where<CachimbaModel>,
  ): Promise<Count> {
    return this.cachimbaModelRepository.count(where);
  }

  @get('/cachimba-models', {
    responses: {
      '200': {
        description: 'Array of CachimbaModel model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(CachimbaModel, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(CachimbaModel) filter?: Filter<CachimbaModel>,
  ): Promise<CachimbaModel[]> {
    return this.cachimbaModelRepository.find(filter);
  }

  @patch('/cachimba-models', {
    responses: {
      '200': {
        description: 'CachimbaModel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CachimbaModel, {partial: true}),
        },
      },
    })
    cachimbaModel: CachimbaModel,
    @param.where(CachimbaModel) where?: Where<CachimbaModel>,
  ): Promise<Count> {
    return this.cachimbaModelRepository.updateAll(cachimbaModel, where);
  }

  @get('/cachimba-models/{id}', {
    responses: {
      '200': {
        description: 'CachimbaModel model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CachimbaModel, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(CachimbaModel, {exclude: 'where'}) filter?: FilterExcludingWhere<CachimbaModel>
  ): Promise<CachimbaModel> {
    return this.cachimbaModelRepository.findById(id, filter);
  }

  @patch('/cachimba-models/{id}', {
    responses: {
      '204': {
        description: 'CachimbaModel PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CachimbaModel, {partial: true}),
        },
      },
    })
    cachimbaModel: CachimbaModel,
  ): Promise<void> {
    await this.cachimbaModelRepository.updateById(id, cachimbaModel);
  }

  @put('/cachimba-models/{id}', {
    responses: {
      '204': {
        description: 'CachimbaModel PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() cachimbaModel: CachimbaModel,
  ): Promise<void> {
    await this.cachimbaModelRepository.replaceById(id, cachimbaModel);
  }

  @del('/cachimba-models/{id}', {
    responses: {
      '204': {
        description: 'CachimbaModel DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.cachimbaModelRepository.deleteById(id);
  }
}
