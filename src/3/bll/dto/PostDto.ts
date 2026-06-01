import { CategoryDto } from './CategoryDto';
import { CommentDto } from './CommentDto';
import { UserSummaryDto } from './CommentDto';

export interface PostDto {
  id: number;
  title: string;
  content: string;
  category: CategoryDto;
  author: UserSummaryDto;
  createdAt: string;
  updatedAt: string;
  commentCount: number;
  comments: CommentDto[];
}
