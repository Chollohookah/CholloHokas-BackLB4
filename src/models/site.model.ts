import {Entity, hasMany, model, property} from '@loopback/repository';
import {ItemModel} from './item-model.model';

@model({
  settings: {
    // model definition goes in here
    mongodb: {collection: 'paginas'},
  },
})
export class Site extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id?: string;

  @property({
    type: 'date',
    required: true,
  })
  lastUpdate: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  logo: string;

  @hasMany(() => ItemModel)
  data: ItemModel[];

  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectId'},
  })
  blockId?: string;

  constructor(data?: Partial<Site>) {
    super(data);
  }
}

export interface SiteRelations {
  // describe navigational properties here
}

export type SiteWithRelations = Site & SiteRelations;
