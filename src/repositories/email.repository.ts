import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import axios from 'axios';
import md5 from 'md5';
import {DbDataSource} from '../datasources/db.datasource';
import {ApiMailChimp, MailChimpEmailAdd} from '../interfaces/APIMailChimp';
import {Email, EmailRelations} from '../models';
export class EmailRepository extends DefaultCrudRepository<
  Email,
  typeof Email.prototype.id,
  EmailRelations
> {
  constructor(@inject('datasources.DbDataSource') dataSource: DbDataSource) {
    super(Email, dataSource);
  }

  public async createWithMailChimp(email: Email) {
    let apiMC = {
      APIKey: process.env.API_KEY_MAILCHIMP as any,
      APIServer: process.env.API_SERVER_MAILCHIMP as any,
    };
    // let resPing = await this.pingAPI(apiMC);
    let emailDevuelto;
    try {
      emailDevuelto = await this.getEmail(email, apiMC);
    } catch (error) {
      return await this.addEmail(email, apiMC);
    }
    if (emailDevuelto)
      throw new HttpErrors.Conflict(`El email ${email.email} ya existe.`);
  }

  private async getEmail(email: Email, api: ApiMailChimp) {
    try {
      let baseurl = `https://${api.APIServer}.api.mailchimp.com/3.0`;
      let subscriberHash = md5(email.email);
      const subscriberData = await axios.get(
        `${baseurl}/lists/${process.env.ID_LIST_API}/members/${subscriberHash}`,
        {headers: {Authorization: `Bearer ${api.APIKey}`}},
      );
      return subscriberData.data;
    } catch (error) {
      throw new HttpErrors.NotFound(
        `El email ${email.email} no fue encontrado en los registros.`,
      );
    }
  }

  private async addEmail(email: Email, api: ApiMailChimp) {
    try {
      let baseurl = `https://${api.APIServer}.api.mailchimp.com/3.0`;
      let mailChimpObject: MailChimpEmailAdd = {
        email_address: email.email,
        status: 'subscribed',
        merge_fields: {},
        tags: ['new_subscribers '],
      };
      const subscriberData = await axios.post(
        `${baseurl}/lists/${process.env.ID_LIST_API}/members`,
        mailChimpObject,
        {headers: {Authorization: `Bearer ${api.APIKey}`}},
      );
      return subscriberData.data;
    } catch (error) {
      throw new HttpErrors.NotFound(`Algo fue mal ${error}`);
    }
  }
}
