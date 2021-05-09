import {Getter, inject, service} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyThroughRepositoryFactory,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import * as bcrypt from 'bcryptjs';
import * as CryptoJS from 'crypto-js';
import {v4 as uuidv4} from 'uuid';
import {DbDataSource} from '../datasources';
import {
  NodeMailer,
  ResetPasswordFinish,
  Rol,
  User,
  UserRelations,
  UserRol,
} from '../models';
import {EmailService} from '../services/email.service';
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

    @service(EmailService) public email: EmailService,
  ) {
    super(User, dataSource);
    this.rols = this.createHasManyThroughRepositoryFactoryFor(
      'rols',
      rolRepositoryGetter,
      userRolRepositoryGetter,
    );
    this.registerInclusionResolver('rols', this.rols.inclusionResolver);
  }

  public async resetPassword(email: string) {
    if (Utils.validateEmail(email)) {
      let userEncontrado = await this.findOne({
        where: {username: email},
      });
      if (userEncontrado) {
        userEncontrado.resetKey = uuidv4();
        // Updates the user to store their reset key with error handling
        console.log(userEncontrado);
        await this.updateById(userEncontrado.id, userEncontrado);

        const nodeMailer: NodeMailer = await this.email.sendResetPasswordMail(
          userEncontrado,
        );
        if (nodeMailer.accepted.length) {
          return {
            message:
              'Un correo con instrucciones para reiniciar la contra ha sido enviado.',
          };
        }

        // Nodemailer did not complete the request alert the user
        throw new HttpErrors.InternalServerError(
          'Error enviando petición de reinicio de contraseña',
        );
      } else {
        throw new HttpErrors.NotFound(
          'Ninguna cuenta está asociada con ' + email,
        );
      }
    } else {
      throw new HttpErrors.BadRequest(
        `${email} no es un correo electronico valido.`,
      );
    }
  }

  public async resetPasswordFinish(resetPasswordFinish: ResetPasswordFinish) {
    let decrypted = CryptoJS.AES.decrypt(
      resetPasswordFinish.encriptedPass,
      process.env.AES_KEY as any,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      },
    ).toString(CryptoJS.enc.Utf8);

    const {pass, resetKey} = await Utils.validateKeyPassword(
      decrypted,
      resetPasswordFinish.resetKey,
    );

    // Search for a user using reset key
    const foundUser = await this.findOne({
      where: {resetKey: resetKey},
    });
    //U2FsdGVkX1892Okyq5dJ1R+A/lr8ZryMS1Go7zNKqrU=
    //VTJGc2RHVmtYMTg5Mk9reXE1ZEoxUitBL2xyOFpyeU1TMUdvN3pOS3FyVT0=
    // No user account found
    if (!foundUser) {
      throw new HttpErrors.NotFound(
        'No hay una cuenta associada a la resetkey aportada',
      );
    }
    // Encrypt password to avoid storing it as plain text
    let hash = bcrypt.hashSync(decrypted, 8);
    try {
      // Update user password with the newly provided password
      foundUser.pass = hash;
      foundUser.resetKey = '';
      // Update the user removing the reset key
      await this.updateById(foundUser.id, foundUser);
    } catch (e) {
      return e;
    }

    return {message: 'Reinicio de contraseña realizado correctamente'};
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
