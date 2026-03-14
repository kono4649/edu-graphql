# edu-graphql

GraphQL の Query・Mutation・Subscription を実際に動かしながら学べる学習用 Web アプリケーションです。

## 概要

- **バックエンド**: FastAPI + Strawberry GraphQL + PostgreSQL
- **フロントエンド**: React + TypeScript + Apollo Client + Tailwind CSS
- **認証**: JWT (JSON Web Token)
- **リアルタイム通信**: GraphQL Subscription (WebSocket)

## 機能

| 機能 | 説明 |
|------|------|
| ユーザー登録 / ログイン | メールアドレスとパスワードで認証（JWT発行） |
| Todo CRUD | Query / Mutation の学習用サンプル |
| メッセージ & リアルタイム配信 | Subscription の学習用チャット |
| 学習進捗管理 | Query・Mutation・Subscription の理解度を記録 |
| Playground | 自由に GraphQL を試せるエディタ画面 |

## 画面構成

| パス | 画面 |
|------|------|
| `/login` | ログイン |
| `/register` | ユーザー登録 |
| `/playground` | GraphQL Playground |
| `/learn/query` | Query を学ぶ |
| `/learn/mutation` | Mutation を学ぶ |
| `/learn/subscription` | Subscription を学ぶ |

## GraphQL スキーマ

### Query

```graphql
todos: [TodoType!]!
messages: [MessageType!]!
myProgress: [ProgressType!]!
```

### Mutation

```graphql
createTodo(title: String!): TodoType!
updateTodo(id: ID!, done: Boolean!): TodoType!
deleteTodo(id: ID!): Boolean!
createMessage(content: String!): MessageType!
markTopicComplete(topic: String!): ProgressType!
```

### Subscription

```graphql
messageAdded: MessageType!
```

## REST エンドポイント

| メソッド | パス | 説明 |
|----------|------|------|
| POST | `/auth/register` | ユーザー登録 |
| POST | `/auth/login` | ログイン（JWT取得） |
| GET | `/health` | ヘルスチェック |
| GET/POST | `/graphql` | GraphQL エンドポイント |

## セットアップ

### 前提条件

- Docker
- Docker Compose

### 起動手順

```bash
# 1. 環境変数ファイルを作成
cp .env.example .env

# 2. コンテナを起動
docker compose up --build
```

起動後にアクセスできるURL:

| サービス | URL |
|----------|-----|
| フロントエンド | http://localhost:3000 |
| バックエンド (GraphQL) | http://localhost:8000/graphql |
| バックエンド (REST) | http://localhost:8000 |

### 環境変数

`.env.example` をコピーして `.env` を作成し、必要に応じて値を変更してください。

```env
# Database
DATABASE_URL=postgresql+asyncpg://postgres:password@db:5432/graphql_learning

# JWT
JWT_SECRET=your-super-secret-key-change-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_HOURS=24

# PostgreSQL (docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=graphql_learning

# Frontend (Vite)
VITE_GRAPHQL_URL=http://localhost:8000/graphql
VITE_WS_URL=ws://localhost:8000/graphql
VITE_API_BASE=http://localhost:8000
```

## 開発

### バックエンドのテスト

```bash
cd backend
pytest
```

### フロントエンドのテスト

```bash
cd frontend
npm test
```

### フロントエンドの型チェック

```bash
cd frontend
npm run typecheck
```

## ディレクトリ構成

```
edu-graphql/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── main.py              # FastAPI アプリ本体
│   ├── config.py            # 設定
│   ├── database.py          # DB接続
│   ├── auth/                # JWT認証
│   ├── gql/
│   │   ├── schema.py        # GraphQL スキーマ定義
│   │   ├── resolvers/       # Query / Mutation / Subscription
│   │   ├── types/           # GraphQL 型定義
│   │   └── pubsub.py        # Subscription 用 Pub/Sub
│   ├── models/              # SQLAlchemy モデル
│   └── tests/               # テスト
└── frontend/
    └── src/
        ├── features/
        │   ├── auth/        # ログイン / 登録
        │   ├── learn/       # 学習コンテンツ
        │   ├── playground/  # GraphQL Playground
        │   └── progress/    # 学習進捗サイドバー
        ├── pages/           # ページコンポーネント
        └── shared/          # 共通コンポーネント / Apollo Client
```

## 技術スタック

### バックエンド

| ライブラリ | バージョン | 用途 |
|------------|-----------|------|
| FastAPI | 0.111.0 | Web フレームワーク |
| Strawberry GraphQL | 0.227.0 | GraphQL サーバー |
| SQLAlchemy | 2.0.30 | ORM |
| asyncpg | 0.29.0 | PostgreSQL 非同期ドライバ |
| python-jose | 3.3.0 | JWT |
| passlib | 1.7.4 | パスワードハッシュ |

### フロントエンド

| ライブラリ | バージョン | 用途 |
|------------|-----------|------|
| React | 18.x | UI フレームワーク |
| Apollo Client | 3.x | GraphQL クライアント |
| graphql-ws | 5.x | WebSocket Subscription |
| React Router | 6.x | ルーティング |
| Tailwind CSS | 3.x | スタイリング |
| CodeMirror | 6.x | コードエディタ |
| Vite | 5.x | ビルドツール |
