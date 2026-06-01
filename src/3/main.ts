import { createContainer } from './di/container';
import { BlogCli } from './ui/BlogCli';
import { TYPES } from './di/types';

async function main(): Promise<void> {
  const container = createContainer();
  const cli = container.get<BlogCli>(TYPES.BlogCli);
  await cli.run();
}

main().catch((error: unknown) => {
  if (error instanceof Error) {
    process.stderr.write(`${error.message}\n`);
    return;
  }
  process.stderr.write('Unexpected application failure\n');
});
