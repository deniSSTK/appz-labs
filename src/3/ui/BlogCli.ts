import inquirer from 'inquirer';
import { AuthService } from '../bll/services/AuthService';
import { CategoryService } from '../bll/services/CategoryService';
import { CommentService } from '../bll/services/CommentService';
import { PostService } from '../bll/services/PostService';
import { AuthenticationError, ServiceError } from '../bll/errors/ServiceErrors';
import { CommentDto } from '../bll/dto/CommentDto';

type InquirerPrompt = {
  type: string;
  name: string;
  message: string;
  choices?: Array<{ name: string; value: string | number | null } | string>;
  default?: string | number;
  mask?: string;
};

type InquirerApi = {
  prompt<T>(questions: InquirerPrompt[]): Promise<T>;
};

type MenuOption<T> = {
  label: string;
  value: T;
};

export class BlogCli {
  public constructor(
    private readonly authService: AuthService,
    private readonly categoryService: CategoryService,
    private readonly postService: PostService,
    private readonly commentService: CommentService
  ) {}

  public async run(): Promise<void> {
    let exitRequested = false;
    while (!exitRequested) {
      this.renderHeader();
      const action = await this.selectAction(inquirer);

      try {
        switch (action) {
          case 'posts':
            await this.showPosts(inquirer);
            break;
          case 'post-details':
            await this.showPostDetails(inquirer);
            break;
          case 'register':
            await this.registerUser(inquirer);
            break;
          case 'login':
            await this.loginUser(inquirer);
            break;
          case 'logout':
            this.authService.logout();
            this.writeLine('You have been signed out.');
            break;
          case 'create-post':
            await this.createPost(inquirer);
            break;
          case 'add-comment':
            await this.addComment(inquirer);
            break;
          case 'categories':
            await this.showCategories();
            break;
          case 'exit':
            exitRequested = true;
            break;
        }
      } catch (error) {
        this.printError(error);
      }
    }
  }

  private async selectAction(inquirer: InquirerApi): Promise<string> {
    const actions = [
      { label: 'View posts', value: 'posts' },
      { label: 'View post details', value: 'post-details' },
      { label: 'View categories', value: 'categories' },
      { label: 'Register', value: 'register' },
      { label: 'Login', value: 'login' },
      { label: 'Logout', value: 'logout' },
      { label: 'Create post', value: 'create-post' },
      { label: 'Add comment', value: 'add-comment' },
      { label: 'Exit', value: 'exit' }
    ] as const;

    this.writeLine('Available actions:');
    actions.forEach((action, index) => {
      this.writeLine(`${index + 1}. ${action.label}`);
    });

    const answer = await inquirer.prompt<{ actionIndex: string }>([
      {
        type: 'input',
        name: 'actionIndex',
        message: 'Enter the number of your choice'
      }
    ]);

    const selectedIndex = Number(answer.actionIndex);
    if (!Number.isInteger(selectedIndex) || selectedIndex < 1 || selectedIndex > actions.length) {
      throw new Error('Please enter a valid menu number');
    }

    return actions[selectedIndex - 1].value;
  }

  private async showPosts(_: InquirerApi): Promise<void> {
    const posts = await this.postService.listPosts();
    if (posts.length === 0) {
      this.writeLine('No posts are available.');
      return;
    }
    for (const post of posts) {
      this.writeLine(
        `#${post.id} | ${post.title} | ${post.category.name} | by ${post.author.displayName} | comments: ${post.commentCount}`
      );
    }
  }

  private async showPostDetails(inquirer: InquirerApi): Promise<void> {
    const postId = await this.selectPostId(inquirer, 'Choose a post to view');
    const post = await this.postService.getPostById(postId);
    this.writeLine('');
    this.writeLine(`${post.title}`);
    this.writeLine(`Category: ${post.category.name}`);
    this.writeLine(`Author: ${post.author.displayName}`);
    this.writeLine(`Created: ${post.createdAt}`);
    this.writeLine('');
    this.writeLine(post.content);
    this.writeLine('');
    this.writeLine(`Comments: ${post.commentCount}`);
    this.renderComments(post.comments);
  }

  private async registerUser(inquirer: InquirerApi): Promise<void> {
    const answer = await inquirer.prompt<{
      username: string;
      displayName: string;
      password: string;
    }>([
      { type: 'input', name: 'username', message: 'Username' },
      { type: 'input', name: 'displayName', message: 'Display name' },
      { type: 'password', name: 'password', message: 'Password', mask: '*' }
    ]);

    const user = await this.authService.register(answer);
    this.writeLine(`Registered and signed in as ${user.displayName}.`);
  }

  private async loginUser(inquirer: InquirerApi): Promise<void> {
    const answer = await inquirer.prompt<{
      username: string;
      password: string;
    }>([
      { type: 'input', name: 'username', message: 'Username' },
      { type: 'password', name: 'password', message: 'Password', mask: '*' }
    ]);

    const user = await this.authService.login(answer);
    this.writeLine(`Welcome back, ${user.displayName}.`);
  }

  private async createPost(inquirer: InquirerApi): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      throw new AuthenticationError('Please sign in before creating a post');
    }
    const categories = await this.categoryService.listCategories();
    this.writeLine('Available categories:');
    categories.forEach((category, index) => {
      this.writeLine(`${index + 1}. ${category.name} - ${category.description}`);
    });
    const answer = await inquirer.prompt<{
      title: string;
      content: string;
      categoryIndex: string;
    }>([
      { type: 'input', name: 'title', message: 'Title' },
      { type: 'input', name: 'content', message: 'Content' },
      {
        type: 'input',
        name: 'categoryIndex',
        message: 'Enter the category number'
      }
    ]);

    const categoryIndex = Number(answer.categoryIndex);
    if (!Number.isInteger(categoryIndex) || categoryIndex < 1 || categoryIndex > categories.length) {
      throw new Error('Please enter a valid category number');
    }

    const post = await this.postService.createPost({
      title: answer.title,
      content: answer.content,
      categoryId: categories[categoryIndex - 1].id
    });
    this.writeLine(`Created post #${post.id}: ${post.title}`);
  }

  private async addComment(inquirer: InquirerApi): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      throw new AuthenticationError('Please sign in before adding a comment');
    }
    const postId = await this.selectPostId(inquirer, 'Choose a post to comment on');
    const comments = await this.commentService.getCommentsForPost(postId);
    const parentCommentId = await this.selectParentCommentId(inquirer, comments);

    const contentAnswer = await inquirer.prompt<{
      content: string;
    }>([
      {
        type: 'input',
        name: 'content',
        message: 'Comment content'
      }
    ]);

    const comment = await this.commentService.addComment({
      postId,
      parentCommentId,
      content: contentAnswer.content
    });
    this.writeLine(`Added comment #${comment.id}.`);
  }

  private async showCategories(): Promise<void> {
    const categories = await this.categoryService.listCategories();
    for (const category of categories) {
      this.writeLine(`#${category.id} | ${category.name} | ${category.description}`);
    }
  }

  private renderComments(comments: readonly CommentDto[], depth = 0): void {
    for (const comment of comments) {
      const indent = '  '.repeat(depth);
      this.writeLine(
        `${indent}- #${comment.id} ${comment.author.displayName} at ${comment.createdAt}`
      );
      this.writeLine(`${indent}  ${comment.content}`);
      this.renderComments(comment.replies, depth + 1);
    }
  }

  private buildCommentChoices(comments: readonly CommentDto[], depth = 0): MenuOption<number>[] {
    const choices: MenuOption<number>[] = [];
    for (const comment of comments) {
      const prefix = '  '.repeat(depth);
      choices.push({
        label: `${prefix}#${comment.id} ${comment.author.displayName}: ${this.shorten(comment.content)}`,
        value: comment.id
      });
      choices.push(...this.buildCommentChoices(comment.replies, depth + 1));
    }
    return choices;
  }

  private shorten(text: string, maxLength = 40): string {
    const normalized = text.replace(/\s+/g, ' ').trim();
    return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1)}…`;
  }

  private async selectParentCommentId(
    inquirer: InquirerApi,
    comments: readonly CommentDto[]
  ): Promise<number | null> {
    const options: MenuOption<number | null>[] = [
      { label: 'Top-level comment', value: null },
      ...this.buildCommentChoices(comments)
    ];

    this.writeLine('Available parent comments:');
    options.forEach((option, index) => {
      this.writeLine(`${index + 1}. ${option.label}`);
    });

    const answer = await inquirer.prompt<{ parentIndex: string }>([
      {
        type: 'input',
        name: 'parentIndex',
        message: 'Enter the parent comment number'
      }
    ]);

    const parentIndex = Number(answer.parentIndex);
    if (!Number.isInteger(parentIndex) || parentIndex < 1 || parentIndex > options.length) {
      throw new Error('Please enter a valid comment number');
    }

    return options[parentIndex - 1].value;
  }

  private renderHeader(): void {
    const status = this.authService.isAuthenticated() ? 'signed in' : 'guest';
    this.writeLine('');
    this.writeLine('Blog Platform');
    this.writeLine(`Current status: ${status}`);
    this.writeLine('');
  }

  private writeLine(message: string): void {
    process.stdout.write(`${message}\n`);
  }

  private printError(error: unknown): void {
    if (error instanceof AuthenticationError || error instanceof ServiceError) {
      this.writeLine(error.message);
      return;
    }
    if (error instanceof Error) {
      this.writeLine(error.message);
      return;
    }
    this.writeLine('An unexpected error occurred.');
  }

  private async selectPostId(inquirer: InquirerApi, message: string): Promise<number> {
    const posts = await this.postService.listPosts();
    if (posts.length === 0) {
      throw new Error('No posts are available');
    }
    this.writeLine('Available posts:');
    posts.forEach((post, index) => {
      this.writeLine(`${index + 1}. #${post.id} ${post.title} (${post.category.name})`);
    });

    const answer = await inquirer.prompt<{ postIndex: string }>([
      {
        type: 'input',
        name: 'postIndex',
        message
      }
    ]);

    const postIndex = Number(answer.postIndex);
    if (!Number.isInteger(postIndex) || postIndex < 1 || postIndex > posts.length) {
      throw new Error('Please enter a valid post number');
    }

    return posts[postIndex - 1].id;
  }

}
