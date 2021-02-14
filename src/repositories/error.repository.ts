import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Error, ErrorRelations} from '../models';

export class ErrorRepository extends DefaultCrudRepository<
  Error,
  typeof Error.prototype.id,
  ErrorRelations
> {
  constructor(@inject('datasources.DbDataSource') dataSource: DbDataSource) {
    super(Error, dataSource);
  }
}
