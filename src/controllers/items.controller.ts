import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, param,
  patch, post,
  put,
  requestBody
} from '@loopback/rest';
import {ItemModel} from '../models';
import {ItemModelRepository} from '../repositories';

export class ItemController {
  constructor(
    @repository(ItemModelRepository)
    public itemModelRepository: ItemModelRepository,
  ) { }

  @post('/item-models', {
    responses: {
      '200': {
        description: 'ItemModel model instance',
        content: {'application/json': {schema: getModelSchemaRef(ItemModel)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ItemModel, {
            title: 'NewItemModel',
            exclude: ['id'],
          }),
        },
      },
    })
    ItemModel: Omit<ItemModel, 'id'>,
  ): Promise<ItemModel> {
    return this.itemModelRepository.create(ItemModel);
  }

  @get('/item-models/count', {
    responses: {
      '200': {
        description: 'ItemModel model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(ItemModel) where?: Where<ItemModel>,
  ): Promise<Count> {
    return this.itemModelRepository.count(where);
  }

  @get('/item-models', {
    responses: {
      '200': {
        description: 'Array of ItemModel model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(ItemModel, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(ItemModel) filter?: Filter<ItemModel>,
  ): Promise<ItemModel[]> {
    return this.itemModelRepository.find(filter);
  }

  @patch('/item-models', {
    responses: {
      '200': {
        description: 'ItemModel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ItemModel, {partial: true}),
        },
      },
    })
    ItemModel: ItemModel,
    @param.where(ItemModel) where?: Where<ItemModel>,
  ): Promise<Count> {
    return this.itemModelRepository.updateAll(ItemModel, where);
  }

  @get('/item-models/{id}', {
    responses: {
      '200': {
        description: 'ItemModel model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(ItemModel, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ItemModel, {exclude: 'where'}) filter?: FilterExcludingWhere<ItemModel>
  ): Promise<ItemModel> {
    return this.itemModelRepository.findById(id, filter);
  }

  @patch('/item-models/{id}', {
    responses: {
      '204': {
        description: 'ItemModel PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ItemModel, {partial: true}),
        },
      },
    })
    ItemModel: ItemModel,
  ): Promise<void> {
    await this.itemModelRepository.updateById(id, ItemModel);
  }

  @put('/item-models/{id}', {
    responses: {
      '204': {
        description: 'ItemModel PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() ItemModel: ItemModel,
  ): Promise<void> {
    await this.itemModelRepository.replaceById(id, ItemModel);
  }

  @del('/item-models/{id}', {
    responses: {
      '204': {
        description: 'ItemModel DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.itemModelRepository.deleteById(id);
  }
}
