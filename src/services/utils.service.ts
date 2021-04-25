import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import moment from 'moment';
import {promisify} from 'util';
import {ResultShrinkDatabase} from '../interfaces/ResultUtils';
import {Block, User, UserWithToken} from '../models';
import {LoginClass} from '../models/login.model';
import {
  BlockRepository,
  EmailRepository,
  ItemModelRepository,
  RolRepository,
  SiteRepository,
  UserRepository,
  UserRolRepository,
} from '../repositories';
import {Utils} from '../static/Utils';

const fs = require('file-system');
const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

@injectable({scope: BindingScope.TRANSIENT})
export class UtilsService {
  constructor(
    @repository(BlockRepository) private blockRepo: BlockRepository,
    @repository(SiteRepository) private siteRepo: SiteRepository,
    @repository(ItemModelRepository)
    private cachimbaRepo: ItemModelRepository,
    @repository(UserRepository)
    private userRepo: UserRepository,
    @repository(UserRolRepository)
    private userRolRepo: UserRolRepository,
    @repository(RolRepository)
    private rolRepo: RolRepository,
    @repository(EmailRepository)
    private emailRepo: EmailRepository,
  ) {}

  public async shrinkDatabase() {
    let weekAgo = new Date();
    let auxWeekAgo = weekAgo.getDate() - 21;
    weekAgo.setDate(auxWeekAgo);

    let filter: Filter<Block> = {
      include: [
        {
          relation: 'minedIds',
          scope: {
            include: [{relation: 'data'}],
          },
        },
      ],
      where: {dateBlock: {lte: weekAgo}},
    };
    let deletedBlocks = 0,
      deletedSites = 0,
      deletedHookas = 0;
    let allBlocksTodelete = await this.blockRepo.find(filter);
    console.log('Blocks to delete ' + allBlocksTodelete);
    for (const block of allBlocksTodelete) {
      if (block.minedIds && Array.isArray(block.minedIds)) {
        for (const site of block.minedIds) {
          if (site.data && Array.isArray(site.data)) {
            let shishasIds = site.data.map(entry => entry.id);
            console.log('deleting ' + shishasIds.length + ' shishas');
            await this.cachimbaRepo.deleteAll({
              id: {inq: shishasIds},
            });
            deletedHookas = deletedHookas + shishasIds.length;
          }
          console.log('deleting site', site.id);
          await this.siteRepo.deleteById(site.id);
          deletedSites++;
        }
      }
      console.log('deleting block', block.id);
      await this.blockRepo.deleteById(block.id);
      deletedBlocks++;
    }
    console.log([deletedHookas, deletedSites, deletedBlocks]);
    return Promise.resolve({
      deletedBlocks: deletedBlocks,
      deletedSites: deletedSites,
      deletedHookas: deletedHookas,
    } as ResultShrinkDatabase);
  }

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : 'token' is null`,
      );
    }

    let userProfile: UserProfile;
    try {
      // decode user profile from token
      const decodedToken = await verifyAsync(token, process.env.JWT_SECRET);
      let usuario = await this.userRepo.findOne({
        where: {username: decodedToken.email},
      });
      userProfile = Object.assign(
        {[securityId]: '', name: ''},
        {
          [securityId]: usuario?.getId(),
          name: decodedToken.name,
          id: usuario?.getId(),
          role: decodedToken.roles,
        },
      );
    } catch (error) {
      throw new HttpErrors.Unauthorized(
        `Error verifying token : ${error.message}`,
      );
    }
    return userProfile;
  }

  public async login(loginData: LoginClass): Promise<UserWithToken> {
    if (loginData.email && loginData.pass) {
      if (Utils.validateEmail(loginData.email)) {
        let user = await this.userRepo.verifyCredentials(
          loginData.email,
          loginData.pass,
        );
        let userJWT = {
          [securityId]: user.id as any,
          email: user.username,
          name: user.name,
          roles: user.rols.map(entry => entry.codigo),
        };

        let experingTime = moment().add(7, 'days').toDate();

        let token = await signAsync(userJWT, process.env.JWT_SECRET, {
          expiresIn: Number(experingTime),
        });

        return {user, token, expiresIn: Number(experingTime)};
      } else {
        throw new HttpErrors.Unauthorized(
          `${loginData.email} no es un correo electronico valido.`,
        );
      }
    } else {
      throw new HttpErrors.Unauthorized(
        `Debes proveer los campos email y pass.`,
      );
    }
  }

  public async registerUser(user: User) {
    let userCreated = await this.userRepo.createEncriptedUser(user as any);
    let userBasicRol = await this.rolRepo.findOne({
      where: {
        codigo: 'US',
      },
    });
    await this.userRolRepo.create({
      rolId: userBasicRol?.id,
      userId: userCreated.id,
    });

    try {
      await this.emailRepo.createWithMailChimp({
        email: userCreated.username,
      } as any);
    } catch (error) {}
    return userCreated;
  }
}
