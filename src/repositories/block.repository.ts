import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Block, BlockRelations, Site} from '../models';
import {SiteRepository} from './site.repository';

export class BlockRepository extends DefaultCrudRepository<
  Block,
  typeof Block.prototype.id,
  BlockRelations
> {
  public readonly minedIds: HasManyRepositoryFactory<
    Site,
    typeof Block.prototype.id
  >;

  constructor(
    @inject('datasources.DbDataSource') dataSource: DbDataSource,
    @repository.getter('SiteRepository')
    protected siteRepositoryGetter: Getter<SiteRepository>,
  ) {
    super(Block, dataSource);
    this.minedIds = this.createHasManyRepositoryFactoryFor(
      'minedIds',
      siteRepositoryGetter,
    );
    this.registerInclusionResolver('minedIds', this.minedIds.inclusionResolver);
  }

  public async returnLatestValidBlock(filter: any) {
    let bloquesDescendientesFecha = await this.find(
      Object.assign(
        {
          order: ['dateBlock desc'],
        },
        filter,
      ),
    );
    for (const bloque of bloquesDescendientesFecha) {
      let estadoOK = Object.keys(bloque.statuses).every(entry => {
        return (bloque.statuses as any)[entry] === true;
      });
      if (estadoOK) {
        return bloque;
      }
    }
    return bloquesDescendientesFecha[0];
  }
}
