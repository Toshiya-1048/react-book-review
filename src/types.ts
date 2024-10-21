// src/types.ts
export interface ReviewType {
  id: string;
  title: string;
  review: string;
  reviewer: string;
  isMine: boolean; // ログインユーザーが作成したレビューかを示すフラグ
}