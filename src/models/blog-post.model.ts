import {belongsTo, Entity, model, property} from '@loopback/repository';
import {User} from './user.model';

@model()
export class BlogPost extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'date',
    default: () => new Date(),
  })
  created?: string;

  @property({
    type: 'number',
    default: () => {
      return Math.floor(Math.random() * (100 - 10 + 1) + 10);
    },
  })
  likes?: string;

  @property({
    type: 'string',
  })
  imgPostBase64?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  desc: string;

  @property({
    type: 'string',
    required: true,
  })
  htmlContent: string;

  @property({
    type: 'string',
    required: true,
  })
  slug: string;

  @property({
    type: 'boolean',
    required: false,
  })
  visible: boolean;

  @property({
    type: 'boolean',
    required: true,
  })
  draft: boolean;

  @belongsTo(() => User)
  userId: string;

  constructor(data?: Partial<BlogPost>) {
    super(data);
  }
}

export interface BlogPostRelations {
  // describe navigational properties here
}

export type BlogPostWithRelations = BlogPost & BlogPostRelations;
