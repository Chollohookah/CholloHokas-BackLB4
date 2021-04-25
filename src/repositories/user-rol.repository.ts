import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {UserRol, UserRolRelations} from '../models';

export class UserRolRepository extends DefaultCrudRepository<
  UserRol,
  typeof UserRol.prototype.id,
  UserRolRelations
> {
  constructor(@inject('datasources.DbDataSource') dataSource: DbDataSource) {
    super(UserRol, dataSource);
  }
}
