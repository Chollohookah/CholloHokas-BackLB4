import {Entity, model, property} from '@loopback/repository';

@model()
export class CachimbaModel extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  precioRebajado: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  categorias: string[];

  @property({
    type: 'string',
    required: true,
  })
  imagen: string;

  @property({
    type: 'string',
    required: true,
  })
  cantidad: string;

  @property({
    type: 'string',
    required: true,
  })
  precioOriginal: string;

  @property({
    type: 'string',
    required: true,
  })
  marca: string;

  @property({
    type: 'string',
    required: true,
  })
  modelo: string;

  @property({
    type: 'string',
    required: true,
  })
  titulo: string;

  @property({
    type: 'string',
    required: true,
  })
  divisa: string;

  @property({
    type: 'array',
    itemType: 'string',
    required: true,
  })
  etiquetas: string[];

  @property({
    type: 'boolean',
    required: true,
  })
  agotado: boolean;

  @property({
    type: 'string',
    required: true,
  })
  linkProducto: string;


  constructor(data?: Partial<CachimbaModel>) {
    super(data);
  }
}

export interface CachimbaModelRelations {
  // describe navigational properties here
}

export type CachimbaModelWithRelations = CachimbaModel & CachimbaModelRelations;
