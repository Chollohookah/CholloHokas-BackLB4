import {service} from '@loopback/core';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import {ResultShrinkDatabase} from '../interfaces/ResultUtils';
import {LoginClass} from '../models/login.model';
import {UserWithToken} from '../models/user-with-token.model';
import {UtilsService} from '../services';

export class UtilsController {
  constructor(@service(UtilsService) public utils: UtilsService) {}

  @post('/freeSpace', {
    responses: {
      '200': {
        description: 'Site model instance',
        content: {'application/json': {}},
      },
    },
  })
  async create(): Promise<ResultShrinkDatabase> {
    return this.utils.shrinkDatabase();
  }

  @post('/login', {
    responses: {
      '200': {
        description: 'Login response instance',
        content: {'application/json': {}},
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginClass, {
            exclude: [],
          }),
        },
      },
    })
    loginData: LoginClass,
  ): Promise<UserWithToken> {
    return this.utils.login(loginData);
  }
}
