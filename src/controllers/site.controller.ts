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
import {Site} from '../models';
import {SiteRepository} from '../repositories';

export class SiteController {
  constructor(
    @repository(SiteRepository)
    public siteRepository : SiteRepository,
  ) {}

  @post('/sites', {
    responses: {
      '200': {
        description: 'Site model instance',
        content: {'application/json': {schema: getModelSchemaRef(Site)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Site, {
            title: 'NewSite',
            exclude: ['id'],
          }),
        },
      },
    })
    site: Omit<Site, 'id'>,
  ): Promise<Site> {
    return this.siteRepository.create(site);
  }

  @get('/sites/count', {
    responses: {
      '200': {
        description: 'Site model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Site) where?: Where<Site>,
  ): Promise<Count> {
    return this.siteRepository.count(where);
  }

  @get('/sites', {
    responses: {
      '200': {
        description: 'Array of Site model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Site, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Site) filter?: Filter<Site>,
  ): Promise<Site[]> {
    return this.siteRepository.find(filter);
  }

  @patch('/sites', {
    responses: {
      '200': {
        description: 'Site PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Site, {partial: true}),
        },
      },
    })
    site: Site,
    @param.where(Site) where?: Where<Site>,
  ): Promise<Count> {
    return this.siteRepository.updateAll(site, where);
  }

  @get('/sites/{id}', {
    responses: {
      '200': {
        description: 'Site model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Site, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Site, {exclude: 'where'}) filter?: FilterExcludingWhere<Site>
  ): Promise<Site> {
    return this.siteRepository.findById(id, filter);
  }

  @patch('/sites/{id}', {
    responses: {
      '204': {
        description: 'Site PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Site, {partial: true}),
        },
      },
    })
    site: Site,
  ): Promise<void> {
    await this.siteRepository.updateById(id, site);
  }

  @put('/sites/{id}', {
    responses: {
      '204': {
        description: 'Site PUT success',
      },
    },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() site: Site,
  ): Promise<void> {
    await this.siteRepository.replaceById(id, site);
  }

  @del('/sites/{id}', {
    responses: {
      '204': {
        description: 'Site DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.siteRepository.deleteById(id);
  }
}
