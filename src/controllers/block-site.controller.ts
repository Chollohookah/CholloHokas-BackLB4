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
  Block,
  Site,
} from '../models';
import {BlockRepository} from '../repositories';

export class BlockSiteController {
  constructor(
    @repository(BlockRepository) protected blockRepository: BlockRepository,
  ) { }

  @get('/blocks/{id}/sites', {
    responses: {
      '200': {
        description: 'Array of Block has many Site',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Site)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Site>,
  ): Promise<Site[]> {
    return this.blockRepository.minedIds(id).find(filter);
  }

  @post('/blocks/{id}/sites', {
    responses: {
      '200': {
        description: 'Block model instance',
        content: {'application/json': {schema: getModelSchemaRef(Site)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Block.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Site, {
            title: 'NewSiteInBlock',
            exclude: ['id'],
            optional: ['blockId']
          }),
        },
      },
    }) site: Omit<Site, 'id'>,
  ): Promise<Site> {
    return this.blockRepository.minedIds(id).create(site);
  }

  @patch('/blocks/{id}/sites', {
    responses: {
      '200': {
        description: 'Block.Site PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Site, {partial: true}),
        },
      },
    })
    site: Partial<Site>,
    @param.query.object('where', getWhereSchemaFor(Site)) where?: Where<Site>,
  ): Promise<Count> {
    return this.blockRepository.minedIds(id).patch(site, where);
  }

  @del('/blocks/{id}/sites', {
    responses: {
      '200': {
        description: 'Block.Site DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Site)) where?: Where<Site>,
  ): Promise<Count> {
    return this.blockRepository.minedIds(id).delete(where);
  }
}
