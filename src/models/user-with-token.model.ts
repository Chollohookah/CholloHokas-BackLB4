import {model, property} from '@loopback/repository';
import {User} from './user.model';

@model({settings: {strict: false}})
export class UserWithToken {
  @property({
    type: 'object',
    required: true,
  })
  user: User;

  @property({
    type: 'string',
    required: true,
  })
  token: string;

  @property({
    type: 'number',
    required: true,
  })
  expiresIn: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<UserWithToken>) {}
}

export interface UserWithTokenRelations {
  // describe navigational properties here
}

export type UserWithTokenWithRelations = UserWithToken & UserWithTokenRelations;
