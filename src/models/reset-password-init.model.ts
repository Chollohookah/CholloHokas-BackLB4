// inside src/models/reset-password-init.model.ts

import {Model, model, property} from '@loopback/repository';

@model()
export class ResetPasswordInit extends Model {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  constructor(data?: Partial<ResetPasswordInit>) {
    super(data);
  }
}
