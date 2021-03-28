import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {ItemModel, ItemModelRelations} from '../models';

export class ItemModelRepository extends DefaultCrudRepository<
  ItemModel,
  typeof ItemModel.prototype.id,
  ItemModelRelations
  > {
  constructor(@inject('datasources.DbDataSource') dataSource: DbDataSource) {
    super(ItemModel, dataSource);
  }
}
