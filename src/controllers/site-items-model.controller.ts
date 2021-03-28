import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest';
import {
  ItemModel, Site
} from '../models';
import {SiteRepository} from '../repositories';

export class SiteItemsModelController {
  constructor(
    @repository(SiteRepository) protected siteRepository: SiteRepository,
  ) { }

  @get('/sites/{id}/items-models', {
    responses: {
      '200': {
        description: 'Array of Site has many ItemsModel',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ItemModel)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ItemModel>,
  ): Promise<ItemModel[]> {
    return this.siteRepository.data(id).find(filter);
  }

  @post('/sites/{id}/items-models', {
    responses: {
      '200': {
        description: 'Site model instance',
        content: {'application/json': {schema: getModelSchemaRef(ItemModel)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Site.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ItemModel, {
            title: 'NewItemsModelInSite',
            exclude: ['id'],
            optional: ['siteId']
          }),
        },
      },
    }) ItemsModel: Omit<ItemModel, 'id'>,
  ): Promise<ItemModel> {
    return this.siteRepository.data(id).create(ItemsModel);
  }

  @patch('/sites/{id}/items-models', {
    responses: {
      '200': {
        description: 'Site.ItemsModel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ItemModel, {partial: true}),
        },
      },
    })
    ItemsModel: Partial<ItemModel>,
    @param.query.object('where', getWhereSchemaFor(ItemModel)) where?: Where<ItemModel>,
  ): Promise<Count> {
    return this.siteRepository.data(id).patch(ItemsModel, where);
  }

  @del('/sites/{id}/items-models', {
    responses: {
      '200': {
        description: 'Site.ItemsModel DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ItemModel)) where?: Where<ItemModel>,
  ): Promise<Count> {
    return this.siteRepository.data(id).delete(where);
  }
}
