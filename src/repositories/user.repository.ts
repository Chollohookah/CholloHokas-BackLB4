import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as bcrypt from 'bcryptjs';
import {DbDataSource} from '../datasources';
import {User, UserRelations} from '../models';
export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  constructor(@inject('datasources.DbDataSource') dataSource: DbDataSource) {
    super(User, dataSource);
  }

  public async createEncriptedUser(user: User) {
    let userEncontrado = await this.findOne({where: {username: user.username}});
    if (userEncontrado) {
      throw new HttpErrors.NotAcceptable(
        `El usuario ${user.username} ya existe.`,
      );
    } else {
      if (user.username && user.pass) {
        let hash = bcrypt.hashSync(user.pass, 8);
        user.pass = hash;
        return await this.save(user);
      } else {
        throw new HttpErrors.BadRequest(
          `Usuario y contraseña son obligatorios.`,
        );
      }
    }
  }

  public async returnUser(username: string, unencryptedPass: string) {
    let userEncontrado = await this.findOne({where: {username}});
    if (userEncontrado) {
      let hash = userEncontrado.pass;
      if (bcrypt.compareSync(unencryptedPass, hash)) {
        return userEncontrado;
      } else {
        throw new HttpErrors[401]('Las contraseñas no coinciden');
      }
    } else {
      throw new HttpErrors.NotAcceptable(`El usuario ${username} no existe.`);
    }
  }
}
