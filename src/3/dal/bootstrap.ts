import { CategoryEntity } from './entities/CategoryEntity';
import { CommentEntity } from './entities/CommentEntity';
import { PostEntity } from './entities/PostEntity';
import { UserEntity } from './entities/UserEntity';
import { InMemoryDatabaseContext } from './inMemory/InMemoryDatabaseContext';
import { UnitOfWork } from './UnitOfWork';
import { IUnitOfWork } from './interfaces/IUnitOfWork';
import { createPasswordHash } from '../shared/password';

type SeedData = {
  users: UserEntity[];
  categories: CategoryEntity[];
  posts: PostEntity[];
  comments: CommentEntity[];
};

export async function createSeededUnitOfWork(): Promise<IUnitOfWork> {
  const seed = buildSeedData();
  const context = new InMemoryDatabaseContext(seed);
  return new UnitOfWork(context);
}

function buildSeedData(): SeedData {
  const now = new Date().toISOString();
  return {
    users: [
      {
        id: 1,
        username: 'admin',
        displayName: 'Admin Writer',
        passwordHash: createPasswordHash('admin123'),
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        username: 'alice',
        displayName: 'Alice Reader',
        passwordHash: createPasswordHash('alice123'),
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        username: 'bob',
        displayName: 'Bob Editor',
        passwordHash: createPasswordHash('bob123'),
        createdAt: now,
        updatedAt: now
      }
    ],
    categories: [
      {
        id: 1,
        name: 'Technology',
        description: 'Engineering, systems, and developer stories',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        name: 'Culture',
        description: 'Community updates and product thinking',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        name: 'Tutorials',
        description: 'Practical how-to guides',
        createdAt: now,
        updatedAt: now
      }
    ],
    posts: [
      {
        id: 1,
        title: 'Designing a Clean TypeScript Architecture',
        content: 'A pragmatic approach to layering, interfaces, and testable domain logic.',
        categoryId: 1,
        authorUserId: 1,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        title: 'What Makes a Great Developer Blog',
        content: 'Consistency, clarity, and practical examples are the strongest ingredients.',
        categoryId: 2,
        authorUserId: 2,
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        title: 'Building a Nested Comment Tree',
        content:
          'Recursive data structures become manageable when services own the business rules.',
        categoryId: 3,
        authorUserId: 3,
        createdAt: now,
        updatedAt: now
      }
    ],
    comments: [
      {
        id: 1,
        postId: 1,
        parentCommentId: null,
        authorUserId: 2,
        content: 'This architecture is easy to follow and adapt.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 2,
        postId: 1,
        parentCommentId: 1,
        authorUserId: 3,
        content: 'I agree, especially the strict separation of concerns.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 3,
        postId: 1,
        parentCommentId: 2,
        authorUserId: 1,
        content: 'That nested reply chain is a good real-world example.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 4,
        postId: 2,
        parentCommentId: null,
        authorUserId: 1,
        content: 'The focus on practical examples really matters.',
        createdAt: now,
        updatedAt: now
      },
      {
        id: 5,
        postId: 3,
        parentCommentId: null,
        authorUserId: 2,
        content: 'A recursive tree is a natural fit here.',
        createdAt: now,
        updatedAt: now
      }
    ]
  };
}
