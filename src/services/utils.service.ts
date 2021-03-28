import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import { /* inject, */ BindingScope, inject, injectable} from '@loopback/core';
import {Filter, repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {ResultShrinkDatabase} from '../interfaces/ResultUtils';
import {Block, UserWithToken} from '../models';
import {LoginClass} from '../models/login.model';
import {
  BlockRepository,
  ItemModelRepository,
  SiteRepository,
  UserRepository
} from '../repositories';
import {Utils} from '../static/Utils';

const fs = require('file-system');

@injectable({scope: BindingScope.TRANSIENT})
export class UtilsService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @repository(BlockRepository) private blockRepo: BlockRepository,
    @repository(SiteRepository) private siteRepo: SiteRepository,
    @repository(ItemModelRepository)
    private cachimbaRepo: ItemModelRepository,
    @repository(UserRepository)
    private userRepo: UserRepository,
  ) { }

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

  public async login(loginData: LoginClass): Promise<UserWithToken> {
    if (loginData.email && loginData.pass) {
      if (Utils.validateEmail(loginData.email)) {
        let user = await this.userRepo.returnUser(
          loginData.email,
          loginData.pass,
        );
        let expireSeconds = 86400;
        let userJWT = {
          [securityId]: user.id as any,
          email: user.email,
          name: user.name,
        };

        let token = await this.jwtService.generateToken(userJWT);

        return {user, token, expiresIn: expireSeconds};
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
}
