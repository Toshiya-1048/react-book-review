import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from "../../pages/Login";

const renderWithRouter = (ui: React.ReactElement) => {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('Login Component', () => {
  test('ログインフォームがレンダリングされている', () => {
    renderWithRouter(<Login />);
    expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/パスワード/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /ログイン/i })).toBeInTheDocument();
  });

  test('入力値に不備がある場合、エラーメッセージが表示される', () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/パスワード/i), {
      target: { value: 'wrongpassword' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    expect(screen.getByText(/メールアドレスまたはパスワードが間違っています/i)).toBeInTheDocument();
  });

  test('入力値に不備がない場合、エラーメッセージが表示されない', () => {
    renderWithRouter(<Login />);

    fireEvent.change(screen.getByLabelText(/メールアドレス/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/パスワード/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /ログイン/i }));

    expect(screen.getByText(/ログインに成功しました/i)).toBeInTheDocument();
  });
});