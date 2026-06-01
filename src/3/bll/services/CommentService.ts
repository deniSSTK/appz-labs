import { IUnitOfWork } from '../../dal/interfaces/IUnitOfWork';
import {  NotFoundError, ValidationError } from '../errors/ServiceErrors';
import { CreateCommentInput } from '../inputs/CreateCommentInput';
import { AuthService } from './AuthService';
import { CommentDto } from '../dto/CommentDto';
import { buildCommentTree } from '../mappers/BlogMapper';

export class CommentService {
  public constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly authService: AuthService
  ) {}

  public async addComment(input: CreateCommentInput): Promise<CommentDto> {
    const authorUserId = await this.authService.requireCurrentUserId();
    this.validateContent(input.content);

    const post = await this.unitOfWork.posts.getById(input.postId);
    if (!post) {
      throw new NotFoundError('Post was not found');
    }

    const parentCommentId = input.parentCommentId ?? null;
    if (parentCommentId !== null) {
      const parent = await this.unitOfWork.comments.getById(parentCommentId);
      if (!parent || parent.postId !== input.postId) {
        throw new ValidationError('Parent comment is invalid for the selected post');
      }
    }

    const now = new Date().toISOString();
    const created = await this.unitOfWork.comments.add({
      postId: input.postId,
      parentCommentId,
      authorUserId,
      content: input.content.trim(),
      createdAt: now,
      updatedAt: now
    });
    await this.unitOfWork.saveChanges();

    const comments = await this.unitOfWork.comments.getAll();
    const users = await this.unitOfWork.users.getAll();
    const tree = buildCommentTree(comments, users, input.postId);
    const createdNode = findComment(tree, created.id);
    if (!createdNode) {
      throw new NotFoundError('Created comment was not found');
    }
    return createdNode;
  }

  public async getCommentsForPost(postId: number): Promise<CommentDto[]> {
    const comments = await this.unitOfWork.comments.getAll();
    const users = await this.unitOfWork.users.getAll();
    return buildCommentTree(comments, users, postId);
  }

  private validateContent(content: string): void {
    if (content.trim().length < 1) {
      throw new ValidationError('Comment content cannot be empty');
    }
  }
}

function findComment(comments: readonly CommentDto[], commentId: number): CommentDto | undefined {
  for (const comment of comments) {
    if (comment.id === commentId) {
      return comment;
    }
    const nested = findComment(comment.replies, commentId);
    if (nested) {
      return nested;
    }
  }
  return undefined;
}
