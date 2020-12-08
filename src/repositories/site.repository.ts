import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CachimbaModel, Site, SiteRelations} from '../models';
import {CachimbaModelRepository} from './cachimba-model.repository';

export class SiteRepository extends DefaultCrudRepository<
  Site,
  typeof Site.prototype.id,
  SiteRelations
> {
  public readonly data: HasManyRepositoryFactory<
    CachimbaModel,
    typeof Site.prototype.id
  >;

  constructor(
    @inject('datasources.DbDataSource') dataSource: DbDataSource,
    @repository.getter('CachimbaModelRepository')
    protected cachimbaModelRepositoryGetter: Getter<CachimbaModelRepository>,
  ) {
    super(Site, dataSource);
    this.data = this.createHasManyRepositoryFactoryFor(
      'data',
      cachimbaModelRepositoryGetter,
    );
    this.registerInclusionResolver('data', this.data.inclusionResolver);
  }
}
