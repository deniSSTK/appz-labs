import { createSeededUnitOfWork } from './dal/bootstrap';
import { AuthService } from './bll/services/AuthService';
import { CategoryService } from './bll/services/CategoryService';
import { CommentService } from './bll/services/CommentService';
import { PostService } from './bll/services/PostService';
import { BlogCli } from './ui/BlogCli';

async function main(): Promise<void> {
  const unitOfWork = await createSeededUnitOfWork();
  const authService = new AuthService(unitOfWork);
  const commentService = new CommentService(unitOfWork, authService);
  const postService = new PostService(unitOfWork, authService, commentService);
  const categoryService = new CategoryService(unitOfWork);
  const cli = new BlogCli(authService, categoryService, postService, commentService);
  await cli.run();
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    process.stderr.write(`${error.message}\n`);
    return;
  }
  process.stderr.write('Unexpected application failure\n');
});
