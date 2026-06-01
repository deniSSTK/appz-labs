export interface CommentDto {
  id: number;
  postId: number;
  parentCommentId: number | null;
  content: string;
  createdAt: string;
  author: UserSummaryDto;
  replies: CommentDto[];
}

export interface UserSummaryDto {
  id: number;
  username: string;
  displayName: string;
}
