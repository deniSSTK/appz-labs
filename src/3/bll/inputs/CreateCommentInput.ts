export interface CreateCommentInput {
  postId: number;
  content: string;
  parentCommentId?: number | null;
}
