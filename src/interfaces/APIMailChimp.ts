export interface ApiMailChimp {
  APIKey: string;
  APIServer: string;
}

export interface MailChimpEmailAdd {
  email_address: string;
  status: 'subscribed';
  merge_fields: Object;
  tags: Array<string>;
}
