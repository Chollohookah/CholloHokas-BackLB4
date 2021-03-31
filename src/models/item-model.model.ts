import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mongodb: {
      collection: 'items',
    },
  },
})
export class ItemModel extends Entity {
  @property({
    type: 'string',
    id: true,
    defaultFn: 'uuidv4',
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

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
    type: 'array',
    itemType: 'string',
    required: false,
  })
  fotos: string[];

  @property({
    type: 'array',
    itemType: 'string',
    required: false,
  })
  colores: string[];

  @property({
    type: 'string',
    required: true,
  })
  imagen: string;

  @property({
    type: 'string',
    required: false,
  })
  shortDesc: string;

  @property({
    type: 'object',
    required: false,
  })
  specs: object;

  @property({
    type: 'string',
    required: true,
  })
  cantidad: string;

  @property({
    type: 'string',
    required: true,
  })
  tipo: string;

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

  @property({
    type: 'string',
    mongodb: {dataType: 'ObjectId'},
  })
  siteId?: string;

  constructor(data?: Partial<ItemModel>) {
    super(data);
  }
}

export interface ItemModelRelations {
  // describe navigational properties here
}

export type ItemModelWithRelations = ItemModel & ItemModelRelations;
