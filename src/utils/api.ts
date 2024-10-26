const API_BASE_URL = 'https://railway.bookreview.techtrain.dev';

export interface ErrorResponse {
  ErrorCode: number;
  ErrorMessageJP: string;
  ErrorMessageEN: string;
}

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    if (response.ok) {
      return data as T;
    } else {
      const errorData: ErrorResponse = data;
      const message = errorData.ErrorMessageJP || '予期しないエラーが発生しました。';
      throw new Error(message); // エラーメッセージをスロー
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message || 'ネットワークエラーが発生しました。');
    } else {
      throw new Error('予期しないエラーが発生しました。');
    }
  }
};
