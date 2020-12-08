import {Entity, model, property, hasMany} from '@loopback/repository';
import {Site} from './site.model';

@model({
  settings: {
    strict: false,
    mongodb: {
      collection: 'bloques',
    },
  },
})
export class Block extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @property({
    type: 'date',
    required: true,
  })
  dateBlock: string;

  @property({
    type: 'object',
    required: true,
  })
  statuses: object;

  @hasMany(() => Site)
  minedIds: Site[];

  [prop: string]: any;

  constructor(data?: Partial<Block>) {
    super(data);
  }
}

export interface BlockRelations {
  // describe navigational properties here
}

export type BlockWithRelations = Block & BlockRelations;
