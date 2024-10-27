// src/types.ts

// レビューの型定義
export interface ReviewType {
  id: string;
  title: string;
  review: string;
  reviewer: string;
  isMine: boolean; // ログインユーザーが作成したレビューかを示すフラグ
}

// ログインフォームの型定義
export interface LoginFormData {
  email: string;
  password: string;
}

// 新規レビュー投稿フォームの型定義
export interface ReviewFormData {
  title: string;
  url: string;
  detail: string;
  review: string;
}

// ユーザー登録フォームの型定義
export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  icon: FileList;
}

// プロフィール編集フォームの型定義
export interface ProfileFormData {
  name: string;
  icon: FileList;
}

// ユーザーデータの型定義
export interface UserData {
  name: string;
  iconUrl: string;
}

// エラーレスポンスの型定義
export interface ErrorResponse {
  ErrorCode: number;
  ErrorMessageJP: string;
  ErrorMessageEN: string;
}

// 本の詳細データの型定義
export interface BookDetail {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  isMine: boolean;
}

// 認証コンテキストの型定義
export interface AuthContextType {
  isLoggedIn: boolean;
  userName: string;
  iconUrl: string;
  login: (token: string, name: string, iconUrl: string) => void;
  logout: () => void;
  updateUserName: (name: string, icon: string) => void;
}

// レビューのページネーションプロパティの型定義
export interface ReviewPaginationProps {
  currentPage: number;
  hasNextPage: boolean;
}

// Redux ストアの型定義
export interface RootState {
  reviews: ReviewsState;
}

// 現在のページ番号の型定義
export interface ReviewsState {
  currentPage: number;
}
