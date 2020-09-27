import {Entity, model, property} from '@loopback/repository';
import {CachimbaModel} from './cachimba-model.model';

@model({
  settings: {
    // model definition goes in here
    mongodb: {collection: 'minadas'},
  },
})
export class Site extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
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

  @property({
    type: 'array',
    itemType: 'object',
    required: true,
  })
  data: CachimbaModel[];

  constructor(data?: Partial<Site>) {
    super(data);
  }
}

export interface SiteRelations {
  // describe navigational properties here
}

export type SiteWithRelations = Site & SiteRelations;
