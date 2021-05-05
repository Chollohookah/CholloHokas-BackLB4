import {Model, model, property} from '@loopback/repository';

@model()
export class ResetPasswordFinish extends Model {
  @property({
    type: 'string',
    required: true,
  })
  resetKey: string;

  @property({
    type: 'string',
    required: true,
  })
  encriptedPass: string;


  constructor(data?: Partial<ResetPasswordFinish>) {
    super(data);
  }
}

export interface ResetPasswordFinishRelations {
  // describe navigational properties here
}

export type ResetPasswordFinishWithRelations = ResetPasswordFinish & ResetPasswordFinishRelations;
