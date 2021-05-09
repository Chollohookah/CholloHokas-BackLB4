import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {BlogPost, BlogPostRelations, User} from '../models';
import {UserRepository} from './user.repository';

export class BlogPostRepository extends DefaultCrudRepository<
  BlogPost,
  typeof BlogPost.prototype.id,
  BlogPostRelations
> {
  public readonly user: BelongsToAccessor<User, typeof BlogPost.prototype.id>;

  constructor(
    @inject('datasources.DbDataSource') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(BlogPost, dataSource);
    this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }

  public findBySlug(slug: string) {
    return this.findOne({
      where: {
        slug,
      },
    });
  }
}
