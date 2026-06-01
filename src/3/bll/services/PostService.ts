import { IUnitOfWork } from '../../dal/interfaces/IUnitOfWork';
import { AuthenticationError, NotFoundError, ValidationError } from '../errors/ServiceErrors';
import { CreatePostInput } from '../inputs/CreatePostInput';
import { AuthService } from './AuthService';
import { PostDto } from '../dto/PostDto';
import { toPostDto, toPostSummaryDto } from '../mappers/BlogMapper';
import { CommentService } from './CommentService';

export class PostService {
  public constructor(
    private readonly unitOfWork: IUnitOfWork,
    private readonly authService: AuthService,
    private readonly commentService: CommentService
  ) {}

  public async listPosts(): Promise<PostDto[]> {
    const posts = await this.unitOfWork.posts.getAll();
    const categories = await this.unitOfWork.categories.getAll();
    const users = await this.unitOfWork.users.getAll();
    const comments = await this.unitOfWork.comments.getAll();

    return posts.map((post) => {
      const category = categories.find((item) => item.id === post.categoryId);
      const author = users.find((item) => item.id === post.authorUserId);
      if (!category || !author) {
        throw new NotFoundError('Post relationships are broken');
      }
      const commentCount = comments.filter((comment) => comment.postId === post.id).length;
      return toPostSummaryDto(post, category, author, commentCount);
    });
  }

  public async getPostById(postId: number): Promise<PostDto> {
    const post = await this.unitOfWork.posts.getById(postId);
    if (!post) {
      throw new NotFoundError('Post was not found');
    }

    const category = await this.unitOfWork.categories.getById(post.categoryId);
    const author = await this.unitOfWork.users.getById(post.authorUserId);
    if (!category || !author) {
      throw new NotFoundError('Post relationships are broken');
    }

    const comments = await this.commentService.getCommentsForPost(post.id);
    return toPostDto(post, category, author, comments);
  }

  public async createPost(input: CreatePostInput): Promise<PostDto> {
    const authorUserId = await this.authService.requireCurrentUserId();
    this.validateTitle(input.title);
    this.validateContent(input.content);

    const category = await this.unitOfWork.categories.getById(input.categoryId);
    if (!category) {
      throw new ValidationError('Selected category does not exist');
    }

    const now = new Date().toISOString();
    const post = await this.unitOfWork.posts.add({
      title: input.title.trim(),
      content: input.content.trim(),
      categoryId: input.categoryId,
      authorUserId,
      createdAt: now,
      updatedAt: now
    });
    await this.unitOfWork.saveChanges();

    const author = await this.unitOfWork.users.getById(authorUserId);
    if (!author) {
      throw new AuthenticationError('Current user was not found');
    }
    return toPostDto(post, category, author, []);
  }

  private validateTitle(title: string): void {
    if (title.trim().length < 3) {
      throw new ValidationError('Title must contain at least 3 characters');
    }
  }

  private validateContent(content: string): void {
    if (content.trim().length < 10) {
      throw new ValidationError('Content must contain at least 10 characters');
    }
  }
}
