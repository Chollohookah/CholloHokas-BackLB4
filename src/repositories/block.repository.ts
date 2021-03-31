import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {DbDataSource} from '../datasources';
import {Block, BlockRelations, Site} from '../models';
import {SiteRepository} from './site.repository';

export class BlockRepository extends DefaultCrudRepository<
  Block,
  typeof Block.prototype.id,
  BlockRelations
> {
  public readonly minedIds: HasManyRepositoryFactory<
    Site,
    typeof Block.prototype.id
  >;

  constructor(
    @inject('datasources.DbDataSource') dataSource: DbDataSource,
    @repository.getter('SiteRepository')
    protected siteRepositoryGetter: Getter<SiteRepository>,
  ) {
    super(Block, dataSource);
    this.minedIds = this.createHasManyRepositoryFactoryFor(
      'minedIds',
      siteRepositoryGetter,
    );
    this.registerInclusionResolver('minedIds', this.minedIds.inclusionResolver);
  }

  public async returnLatestValidBlock(filter?: any, typeItem?: string) {
    if (typeItem && !this.checkIfTypeIsCorrect(typeItem)) {
      throw new HttpErrors.BadRequest(
        `Has introducido un tipo de item incorrecto.`,
      );
    }
    let baseFilter = {
      order: 'dateBlock desc',
    };
    let include = {
      include: [
        {
          relation: 'minedIds',
          where: {name: 'BengalaSpain'},
          scope: {
            include: [
              {
                relation: 'data',
                scope: typeItem
                  ? {
                      where: {tipo: typeItem},
                    }
                  : {},
              },
            ],
          },
        },
      ],
    };
    let bloquesDescendientesFecha = await this.find(baseFilter as any);
    for (const bloque of bloquesDescendientesFecha) {
      let estadoOK = Object.keys(bloque.statuses).every(entry => {
        return (bloque.statuses as any)[entry] === true;
      });
      if (estadoOK) {
        let bloqueReturn = await this.findById(bloque.id, include);
        return bloqueReturn;
      }
    }
    return bloquesDescendientesFecha[0];
  }

  private checkIfTypeIsCorrect(typeItem: string) {
    return [
      'cachimba',
      'sabor',
      'cazoleta',
      'accesorio',
      'carbon',
      'manguera',
      'melaza',
      'esencias',
    ].includes(typeItem.trim().toLowerCase());
  }
}
