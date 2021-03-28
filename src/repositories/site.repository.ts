import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ItemModel, Site, SiteRelations} from '../models';
import {ItemModelRepository} from './item-model.repository';

export class SiteRepository extends DefaultCrudRepository<
  Site,
  typeof Site.prototype.id,
  SiteRelations
  > {
  public readonly data: HasManyRepositoryFactory<
    ItemModel,
    typeof Site.prototype.id
  >;

  constructor(
    @inject('datasources.DbDataSource') dataSource: DbDataSource,
    @repository.getter('CachimbaModelRepository')
    protected cachimbaModelRepositoryGetter: Getter<ItemModelRepository>,
  ) {
    super(Site, dataSource);
    this.data = this.createHasManyRepositoryFactoryFor(
      'data',
      cachimbaModelRepositoryGetter,
    );
    this.registerInclusionResolver('data', this.data.inclusionResolver);
  }
}
