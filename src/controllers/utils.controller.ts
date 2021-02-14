import {service} from '@loopback/core';
import {post} from '@loopback/rest';
import {ResultShrinkDatabase} from '../interfaces/ResultUtils';
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
}
