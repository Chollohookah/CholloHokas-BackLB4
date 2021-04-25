import {Entity, model, property} from '@loopback/repository';

@model()
export class UserRol extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  rolId: string;


  constructor(data?: Partial<UserRol>) {
    super(data);
  }
}

export interface UserRolRelations {
  // describe navigational properties here
}

export type UserRolWithRelations = UserRol & UserRolRelations;
