import {Entity, model, property} from '@loopback/repository';

@model()
export class LoginClass extends Entity {
  @property() pass: string;

  @property() email: string;

  constructor(data?: Partial<LoginClass>) {
    super(data);
  }
}
