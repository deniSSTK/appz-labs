import { Identifiable } from '../interfaces/Identifiable';

export interface CommentEntity extends Identifiable {
  postId: number;
  parentCommentId: number | null;
  authorUserId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}
