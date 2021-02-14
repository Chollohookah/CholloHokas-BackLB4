import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    // model definition goes in here
    mongodb: {collection: 'errores'},
  },
})
export class Error extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  pagina: string;

  @property({
    type: 'string',
    required: true,
  })
  mensajeError: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo: string;

  @property({
    type: 'date',
    required: true,
  })
  date: string;

  @property({
    type: 'string',
    required: true,
  })
  estado: string;

  constructor(data?: Partial<Error>) {
    super(data);
  }
}

export interface ErrorRelations {
  // describe navigational properties here
}

export type ErrorWithRelations = Error & ErrorRelations;
