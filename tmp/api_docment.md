swagger: '2.0'
info:
  description: TechTrain Railway 書籍レビューアプリ API
  version: 1.0.0
  title: TechTrain Railway 書籍レビューアプリ API
host: railway.bookreview.techtrain.dev
tags:
  - name: book
  - name: log
  - name: user
schemes:
  - https
paths:
  /signin:
    post:
      tags:
        - user
      summary: ユーザ認証API
      description: |-
        ユーザ認証を行います。
         ユーザのメールアドレス・パスワードによるBasic認証を行い、認証済みユーザには認証トークンを返却します。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: body
          name: body
          description: Request Body
          required: true
          schema:
            $ref: '#/definitions/SigninRequest'
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/SigninResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
  /users:
    post:
      tags:
        - user
      summary: ユーザ情報作成API
      description: |-
        ユーザ情報を作成します。
         ユーザの名前情報、メールアドレス、パスワードをリクエストで受け取り、ユーザIDと認証用のトークンを生成しデータベースへ保存します。
         生成された認証用のトークンがレスポンスとして返されます。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: body
          name: body
          description: Request Body
          required: true
          schema:
            $ref: '#/definitions/UserCreateRequest'
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/UserCreateResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '409':
          description: Conflict error
          schema:
            $ref: '#/definitions/ConflictError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
    get:
      tags:
        - user
      summary: ユーザ情報取得API
      description: |-
        ユーザ情報（ユーザ名）を取得します。
         Authorizationヘッダーに認証情報（JWTトークン）を `Bearer XXX` の形式で付与することで、認証処理やユーザ情報の検索を行います。
         ※iOS, Android RailwayではレスポンスのiconUrlは使用しません。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: header
          name: Authorization
          description: 認証トークン(JWT) `Bearer XXX`
          required: true
          type: string
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/UserGetResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
    put:
      tags:
        - user
      summary: ユーザ情報更新API
      description: ユーザ情報（ユーザ名）の更新をします。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: header
          name: Authorization
          description: 認証トーク(JWT) `Bearer XXX`
          required: true
          type: string
        - in: body
          name: body
          description: Request Body
          required: true
          schema:
            $ref: '#/definitions/UserUpdateRequest'
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/UserUpdateResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
  /public/books:
    get:
      tags:
        - book
      summary: 書籍一覧取得API
      description: |-
        書籍一覧を取得します。
         10件ずつしかデータが返ってこないため、次の10件を取得したい場合はクエリパラメータの `offset` に何番目のデータまでは取得したのかを指定しなくてはなりません。
         例）21件目のデータから取得したい場合は、 `/public/books?offset=20` となります。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: query
          name: offset
          description: 何番目のから10件取得するか
          required: true
          type: string
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/publicBookListGetResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
  /books:
    get:
      tags:
        - book
      summary: 書籍一覧取得API
      description: |-
        書籍一覧を取得します。
         10件ずつしかデータが返ってこないため、次の10件を取得したい場合はクエリパラメータの `offset` に何番目のデータまでは取得したのかを指定しなくてはなりません。
         例）21件目のデータから取得したい場合は、 `/books?offset=20` となります。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: header
          name: Authorization
          description: 認証トーク(JWT) `Bearer XXX`
          required: true
          type: string
        - in: query
          name: offset
          description: 何番目のから10件取得するか
          required: true
          type: string
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/bookListGetResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
    post:
      tags:
        - book
      summary: 書籍投稿API
      description: 書籍の新規作成をします。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: header
          name: Authorization
          description: 認証トークン(JWT) `Bearer XXX`
          required: true
          type: string
        - in: body
          name: body
          description: Request Body
          required: true
          schema:
            $ref: '#/definitions/bookCreateRequest'
      responses:
        '200':
          description: A successful response.
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
  '/books/{id}':
    get:
      tags:
        - book
      summary: 書籍取得API
      description: 書籍情報を取得します。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: header
          name: Authorization
          description: 認証トークン(JWT) `Bearer XXX`
          required: true
          type: string
        - in: path
          name: id
          required: true
          type: string
          description: 書籍ID
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/bookGetResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '404':
          description: Not found error
          schema:
            $ref: '#/definitions/NotFoundError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
    put:
      tags:
        - book
      summary: 書籍更新API
      description: 書籍の更新をします。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: id
          required: true
          type: string
          description: 書籍ID
        - in: header
          name: Authorization
          description: 認証トークン(JWT) `Bearer XXX`
          required: true
          type: string
        - in: body
          name: body
          description: Request Body
          required: true
          schema:
            $ref: '#/definitions/bookUpdateRequest'
      responses:
        '200':
          description: A successful response.
          schema:
            $ref: '#/definitions/bookUpdateResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '404':
          description: Not found error
          schema:
            $ref: '#/definitions/NotFoundError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
    delete:
      tags:
        - book
      summary: 書籍削除API
      description: 書籍の削除をします。
      consumes:
        - application/json
      produces:
        - application/json
      parameters:
        - in: path
          name: id
          required: true
          type: string
          description: 書籍ID
        - in: header
          name: Authorization
          description: 認証トークン(JWT) `Bearer XXX`
          required: true
          type: string
      responses:
        '200':
          description: A successful response.
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '404':
          description: Not found error
          schema:
            $ref: '#/definitions/NotFoundError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
  /logs:
    post:
      summary: ''
      operationId: post-log
      responses:
        '200':
          description: A successful response.
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
      tags:
        - log
      description: 一覧画面で選択した書籍レビューをログとして送信します。
      parameters:
        - type: string
          in: header
          name: Authorization
          description: 認証トーク(JWT) `Bearer XXX`
          required: true
        - in: body
          name: body
          schema:
            $ref: '#/definitions/LogRequest'
  /uploads:
    post:
      summary: 'アイコンアップロードAPI'
      operationId: post-icons
      consumes: ["multipart/form-data"]
      responses:
        '200':
          description: OK
          schema:
            $ref: '#/definitions/IconUploadResponse'
        '400':
          description: Requested data was wrong
          schema:
            $ref: '#/definitions/BadRequestError'
        '401':
          description: Unauthorized error
          schema:
            $ref: '#/definitions/UnauthorizedError'
        '500':
          description: Internal server error
          schema:
            $ref: '#/definitions/InternalServerError'
        '503':
          description: Service unavailable
          schema:
            $ref: '#/definitions/ServiceUnavailableError'
      description: |-
        アイコンアップロードを行います。
        画像拡張子はjpg, pngです。それ以外はエラーを返します。
        ファイルサイズは1MB以下でないとエラーになります。
        すでに登録されている場合は上書きされます。
      parameters:
        - type: string
          in: header
          name: Content-Type
          description: application/xxx
        - in: formData
          type: file
          name: icon
          required: true
        - type: string
          in: header
          name: Authorization
          description: 認証トークン(JWT) `Bearer XXX`
      tags:
        - user
    parameters: []
definitions:
  SigninRequest:
    type: object
    properties:
      email:
        type: string
        description: メールアドレス
      password:
        type: string
        description: パスワード
  SigninResponse:
    type: object
    properties:
      token:
        type: string
        description: クライアント側で保存するトークン
  UserCreateRequest:
    type: object
    properties:
      name:
        type: string
        description: ユーザ名
      email:
        type: string
        description: メールアドレス
      password:
        type: string
        description: パスワード
  UserCreateResponse:
    type: object
    properties:
      token:
        type: string
        description: クライアント側で保存するトークン
  UserGetResponse:
    type: object
    properties:
      name:
        type: string
        description: ユーザ名
      iconUrl:
        type: string
  UserUpdateRequest:
    type: object
    properties:
      name:
        type: string
        description: ユーザ名
  UserUpdateResponse:
    type: object
    properties:
      name:
        type: string
        description: ユーザ名
  bookCreateRequest:
    type: object
    properties:
      title:
        type: string
        description: 書籍タイトル
      url:
        type: string
        description: 書籍情報参照URL
      detail:
        type: string
        description: 書籍詳細情報
      review:
        type: string
        description: 読んだ感想
  bookGetResponse:
    type: object
    properties:
      id:
        type: string
        description: 書籍id
      title:
        type: string
        description: 書籍タイトル
      url:
        type: string
        description: 書籍情報参照URL
      detail:
        type: string
        description: 書籍詳細情報
      review:
        type: string
        description: 読んだ感想
      reviewer:
        type: string
        description: レビュー者（ユーザ名）
      isMine:
        type: boolean
        description: 自分の投稿かどうか
  bookUpdateRequest:
    type: object
    properties:
      title:
        type: string
        description: 書籍タイトル
      url:
        type: string
        description: 書籍情報参照URL
      detail:
        type: string
        description: 書籍詳細情報
      review:
        type: string
        description: 読んだ感想
  bookUpdateResponse:
    type: object
    properties:
      id:
        type: string
        description: 書籍id
      title:
        type: string
        description: 書籍タイトル
      url:
        type: string
        description: 書籍情報参照URL
      detail:
        type: string
        description: 書籍詳細情報
      review:
        type: string
        description: 読んだ感想
      reviewer:
        type: string
        description: レビュー者（ユーザ名）
      isMine:
        type: boolean
        description: 自分の投稿かどうか
  bookListGetResponse:
    type: array
    items:
      $ref: '#/definitions/bookData'
  bookData:
    type: object
    properties:
      id:
        type: string
        description: 書籍id
      title:
        type: string
        description: 書籍タイトル
      url:
        type: string
        description: 書籍情報参照URL
      detail:
        type: string
        description: 書籍詳細情報
      review:
        type: string
        description: 読んだ感想
      reviewer:
        type: string
        description: レビュー者（ユーザ名）
      isMine:
        type: boolean
        description: 自分の投稿かどうか
  publicBookListGetResponse:
    type: array
    items:
      $ref: '#/definitions/publicBookData'
  publicBookData:
    type: object
    properties:
      id:
        type: string
        description: 書籍id
      title:
        type: string
        description: 書籍タイトル
      url:
        type: string
        description: 書籍情報参照URL
      detail:
        type: string
        description: 書籍詳細情報
      review:
        type: string
        description: 読んだ感想
      reviewer:
        type: string
        description: レビュー者（ユーザ名）
  NotFoundError:
    type: object
    properties:
      ErrorCode:
        type: number
        description: エラーコード
        example: 404
      ErrorMessageJP:
        type: string
        description: エラーメッセージ（日本語）
        example: その書籍はまだレビューされていません。
      ErrorMessageEN:
        type: string
        description: エラーメッセージ（英語）
        example: This book is not reviewed yet.
  UnauthorizedError:
    type: object
    properties:
      ErrorCode:
        type: number
        description: エラーコード
        example: 403
      ErrorMessageJP:
        type: string
        description: エラーメッセージ（日本語）
        example: 認証エラー
      ErrorMessageEN:
        type: string
        description: エラーメッセージ（英語）
        example: You are not authorized user
  ConflictError:
    type: object
    properties:
      ErrorCode:
        type: number
        description: エラーコード
        example: 409
      ErrorMessageJP:
        type: string
        description: エラーメッセージ（日本語）
        example: このメールアドレスは既に登録されています
      ErrorMessageEN:
        type: string
        description: エラーメッセージ（英語）
        example: This email is already registered
  BadRequestError:
    type: object
    properties:
      ErrorCode:
        type: number
        description: エラーコード
        example: 400
      ErrorMessageJP:
        type: string
        description: エラーメッセージ（日本語）
        example: バリデーションエラー
      ErrorMessageEN:
        type: string
        description: エラーメッセージ（英語）
        example: validation error
  InternalServerError:
    type: object
    properties:
      ErrorCode:
        type: number
        description: エラーコード
        example: 500
      ErrorMessageJP:
        type: string
        description: エラーメッセージ（日本語）
        example: サーバでエラーが発生しました。
      ErrorMessageEN:
        type: string
        description: エラーメッセージ（英語）
        example: Error occurred at server.
  ServiceUnavailableError:
    type: object
    properties:
      ErrorCode:
        type: number
        description: エラーコード
        example: 503
      ErrorMessageJP:
        type: string
        description: エラーメッセージ（日本語）
        example: 現在サービスを利用できません。Herokuのコールドスタートの影響の可能性もあります。もう一度お試しいただくか、1日経っても改善しない場合は、管理者にお問い合わせください。
      ErrorMessageEN:
        type: string
        description: エラーメッセージ（英語）
        example: 'The service is currently unavailable. It could also be the effect of a cold start on Heroku. Try it again, or if it doesn''t improve after a day, contact your administrator.'
  LogRequest:
    title: LogRequest
    x-stoplight:
      id: bqwvewb8amhy1
    type: object
    properties:
      selectBookId:
        type: string
  IconUploadResponse:
    title: IconUploadResponse
    x-stoplight:
      id: nwctk37ti6nix
    type: object
    properties:
      iconUrl:
        type: string