graph TD;
    A[ログイン画面のテスト] --> B[入力値に不備がある場合]
    B --> C[ログインページに移動]
    C --> D[メールアドレスとパスワードを入力]
    D --> E[ログインボタンをクリック]
    E --> F[エラーメッセージが表示されることを確認]
    F --> G[エラーメッセージ: メールアドレスまたはパスワードが間違っています]

    A --> H[入力値に不備がない場合]
    H --> I[ログインページに移動]
    I --> J[正しいメールアドレスとパスワードを入力]
    J --> K[ログインボタンをクリック]
    K --> L[エラーメッセージが表示されないことを確認]
    L --> M[ログインに成功しましたメッセージを確認]