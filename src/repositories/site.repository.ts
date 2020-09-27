import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources/db.datasource';
import {Site, SiteRelations} from '../models';

export class SiteRepository extends DefaultCrudRepository<
  Site,
  typeof Site.prototype.id,
  SiteRelations
> {
  constructor(
    @inject('datasources.CholloHookaMongoDb') dataSource: DbDataSource,
  ) {
    super(Site, dataSource);
  }
}
