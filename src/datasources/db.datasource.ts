import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class DbDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'DbDataSource';

  constructor(
    @inject('datasources.config.DbDataSource', {optional: true})
    dsConfig: object = {},
  ) {
    super(
      Object.assign(dsConfig, {
        name: 'DbDataSource',
        connector: 'mongodb',
        url: `mongodb+srv://${process.env.USUARIO_DB}:${process.env.PASS_DB}@${process.env.HOST_DB}/${process.env.NOMBRE_BASE_DE_DATOS}?authSource=admin&replicaSet=atlas-s1shvh-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true`,
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        user: process.env.USUARIO_DB,
        password: process.env.PASS_DB,
        database: process.env.NOMBRE_BASE_DE_DATOS,
        useNewUrlParser: true,
      }),
    );
  }
}
