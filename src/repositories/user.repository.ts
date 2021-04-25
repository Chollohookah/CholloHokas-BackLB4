import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as bcrypt from 'bcryptjs';
import {DbDataSource} from '../datasources';
import {Rol, User, UserRelations, UserRol} from '../models';
import {Utils} from '../static/Utils';
import {RolRepository} from './rol.repository';
import {UserRolRepository} from './user-rol.repository';

export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id,
  UserRelations
> {
  public readonly rols: HasManyThroughRepositoryFactory<
    Rol,
    typeof Rol.prototype.id,
    UserRol,
    typeof User.prototype.id
  >;

  constructor(
    @inject('datasources.DbDataSource') dataSource: DbDataSource,
    @repository.getter('UserRolRepository')
    protected userRolRepositoryGetter: Getter<UserRolRepository>,
    @repository.getter('RolRepository')
    protected rolRepositoryGetter: Getter<RolRepository>,
  ) {
    super(User, dataSource);
    this.rols = this.createHasManyThroughRepositoryFactoryFor(
      'rols',
      rolRepositoryGetter,
      userRolRepositoryGetter,
    );
    this.registerInclusionResolver('rols', this.rols.inclusionResolver);
  }

  public async createEncriptedUser(user: User) {
    if (Utils.validateEmail(user.username)) {
      let userEncontrado = await this.findOne({
        where: {username: user.username},
      });
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
    } else {
      throw new HttpErrors.BadRequest(
        `${user.username} no es un correo electronico valido.`,
      );
    }
  }

  public async verifyCredentials(username: string, unencryptedPass: string) {
    let userEncontrado = await this.findOne({
      where: {
        username,
      },
      include: [
        {
          relation: 'rols',
        },
      ],
    });
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
