import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {CachimbaModel, CachimbaModelRelations} from '../models';

export class CachimbaModelRepository extends DefaultCrudRepository<
  CachimbaModel,
  typeof CachimbaModel.prototype.id,
  CachimbaModelRelations
> {
  constructor(@inject('datasources.DbDataSource') dataSource: DbDataSource) {
    super(CachimbaModel, dataSource);
  }
}
