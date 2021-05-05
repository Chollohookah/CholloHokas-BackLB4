import {
  AuthenticationComponent,
  registerAuthenticationStrategy,
} from '@loopback/authentication';
import {SECURITY_SCHEME_SPEC} from '@loopback/authentication-jwt';
import {AuthorizationComponent} from '@loopback/authorization';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {OpenApiSpec, RestApplication} from '@loopback/rest';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {JWTAuthenticationStrategy} from './authentication-strategies/jwt-strategy';
import {MySequence} from './sequence';
import {SECURITY_SPEC} from './utils/security-spec';
export {ApplicationConfig};

export class CholloHookaBackApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    this.component(AuthenticationComponent);
    this.component(AuthorizationComponent);
    // Mount jwt component
    //this.component(JWTAuthenticationComponent);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);

    // Customize @loopback/rest-explorer configuration here
    if (!(process.env.PRODUCTION_ENABLED === 'true')) {
      const spec: OpenApiSpec = {
        openapi: '3.0.0',
        info: {title: 'pkg.name', version: 'pkg.version'},
        paths: {},
        components: {securitySchemes: SECURITY_SCHEME_SPEC},
        servers: [{url: '/api'}],
        security: SECURITY_SPEC,
      };
      this.api(spec);
      this.configure(RestExplorerBindings.COMPONENT).to({
        path: '/explorer',
      });
      this.component(RestExplorerComponent);
    }

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    registerAuthenticationStrategy(this, JWTAuthenticationStrategy);
    //this.add(createBindingFromClass(JWTAuthenticationStrategy));
    //    this.add(createBindingFromClass(JWTAuthenticationStrategy));
  }
}
