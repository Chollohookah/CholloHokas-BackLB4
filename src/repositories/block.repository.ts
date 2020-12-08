import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Block, BlockRelations, Site} from '../models';
import {SiteRepository} from './site.repository';

export class BlockRepository extends DefaultCrudRepository<
  Block,
  typeof Block.prototype.id,
  BlockRelations
> {

  public readonly minedIds: HasManyRepositoryFactory<Site, typeof Block.prototype.id>;

  constructor(
    @inject('datasources.DbDataSource') dataSource: DbDataSource,
    @repository.getter('SiteRepository')
    protected siteRepositoryGetter: Getter<SiteRepository>,
  ) {
    super(Block, dataSource);
    this.minedIds = this.createHasManyRepositoryFactoryFor('minedIds', siteRepositoryGetter,);
    this.registerInclusionResolver('minedIds', this.minedIds.inclusionResolver);
  }
}
