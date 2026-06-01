import { CategoryEntity } from '../../dal/entities/CategoryEntity';
import { CommentEntity } from '../../dal/entities/CommentEntity';
import { PostEntity } from '../../dal/entities/PostEntity';
import { UserEntity } from '../../dal/entities/UserEntity';
import { CategoryDto } from '../dto/CategoryDto';
import { CommentDto, UserSummaryDto } from '../dto/CommentDto';
import { PostDto } from '../dto/PostDto';
import { UserDto } from '../dto/UserDto';

export function toUserSummaryDto(user: UserEntity): UserSummaryDto {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName
  };
}

export function toUserDto(user: UserEntity): UserDto {
  return toUserSummaryDto(user);
}

export function toCategoryDto(category: CategoryEntity): CategoryDto {
  return {
    id: category.id,
    name: category.name,
    description: category.description
  };
}

export function buildCommentTree(
  comments: readonly CommentEntity[],
  users: readonly UserEntity[],
  postId: number
): CommentDto[] {
  const commentDtos = comments
    .filter((comment) => comment.postId === postId)
    .map((comment) => mapComment(comment, users));
  return buildHierarchy(commentDtos, null);
}

export function toPostDto(
  post: PostEntity,
  category: CategoryEntity,
  author: UserEntity,
  comments: CommentDto[]
): PostDto {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: toCategoryDto(category),
    author: toUserSummaryDto(author),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    commentCount: countComments(comments),
    comments
  };
}

export function toPostSummaryDto(
  post: PostEntity,
  category: CategoryEntity,
  author: UserEntity,
  commentCount: number
): PostDto {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: toCategoryDto(category),
    author: toUserSummaryDto(author),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    commentCount,
    comments: []
  };
}

function mapComment(comment: CommentEntity, users: readonly UserEntity[]): CommentDto {
  const author = users.find((user) => user.id === comment.authorUserId);
  if (!author) {
    throw new Error(`Author ${comment.authorUserId} was not found`);
  }
  return {
    id: comment.id,
    postId: comment.postId,
    parentCommentId: comment.parentCommentId,
    content: comment.content,
    createdAt: comment.createdAt,
    author: toUserSummaryDto(author),
    replies: []
  };
}

function buildHierarchy(nodes: CommentDto[], parentCommentId: number | null): CommentDto[] {
  return nodes
    .filter((node) => node.parentCommentId === parentCommentId)
    .map((node) => ({
      ...node,
      replies: buildHierarchy(nodes, node.id)
    }));
}

function countComments(comments: readonly CommentDto[]): number {
  return comments.reduce((total, comment) => total + 1 + countComments(comment.replies), 0);
}
