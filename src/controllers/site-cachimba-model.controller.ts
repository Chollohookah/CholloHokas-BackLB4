import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Site,
  CachimbaModel,
} from '../models';
import {SiteRepository} from '../repositories';

export class SiteCachimbaModelController {
  constructor(
    @repository(SiteRepository) protected siteRepository: SiteRepository,
  ) { }

  @get('/sites/{id}/cachimba-models', {
    responses: {
      '200': {
        description: 'Array of Site has many CachimbaModel',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CachimbaModel)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<CachimbaModel>,
  ): Promise<CachimbaModel[]> {
    return this.siteRepository.data(id).find(filter);
  }

  @post('/sites/{id}/cachimba-models', {
    responses: {
      '200': {
        description: 'Site model instance',
        content: {'application/json': {schema: getModelSchemaRef(CachimbaModel)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Site.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CachimbaModel, {
            title: 'NewCachimbaModelInSite',
            exclude: ['id'],
            optional: ['siteId']
          }),
        },
      },
    }) cachimbaModel: Omit<CachimbaModel, 'id'>,
  ): Promise<CachimbaModel> {
    return this.siteRepository.data(id).create(cachimbaModel);
  }

  @patch('/sites/{id}/cachimba-models', {
    responses: {
      '200': {
        description: 'Site.CachimbaModel PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CachimbaModel, {partial: true}),
        },
      },
    })
    cachimbaModel: Partial<CachimbaModel>,
    @param.query.object('where', getWhereSchemaFor(CachimbaModel)) where?: Where<CachimbaModel>,
  ): Promise<Count> {
    return this.siteRepository.data(id).patch(cachimbaModel, where);
  }

  @del('/sites/{id}/cachimba-models', {
    responses: {
      '200': {
        description: 'Site.CachimbaModel DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(CachimbaModel)) where?: Where<CachimbaModel>,
  ): Promise<Count> {
    return this.siteRepository.data(id).delete(where);
  }
}
