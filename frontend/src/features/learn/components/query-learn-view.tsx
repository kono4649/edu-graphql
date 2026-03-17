import { LearnContent } from './learn-content'
import { UnderstandButton } from './understand-button'

const SECTIONS = [
  {
    title: 'Query とは',
    body: 'Query はサーバーからデータを取得するための GraphQL オペレーションです。REST API でいう GET リクエストに相当します。必要なフィールドだけを指定できるため、過剰なデータ取得（Over-fetching）を防げます。',
    code: `query {
  todos {
    id
    title
    done
  }
}`,
  },
  {
    title: 'フィールド選択',
    body: 'GraphQL の最大の特徴は「必要なフィールドだけを取得できる」ことです。クライアントがレスポンスの形を指定するため、不要なデータを受け取りません。',
    code: `# title だけほしい場合
query {
  todos {
    title
  }
}

# id と done だけほしい場合
query {
  todos {
    id
    done
  }
}`,
  },
  {
    title: '引数の渡し方 ① インライン',
    body: '引数を直接クエリに書き込む方法です。値をそのまま埋め込むので、手軽に試せます。Mutation のサンプルでもこの形式を使っています。',
    code: `# タイトルを直接指定する例
mutation {
  createTodo(title: "買い物リストを作る") {
    id
    title
    done
  }
}`,
  },
  {
    title: '引数の渡し方 ② 変数（Variables）',
    body: 'クエリに $変数名 を宣言し、値を「変数パネル」に JSON で渡す方法です。再利用しやすく、Apollo Client での実装にも対応します。Playground の左下にある「変数」エリアに JSON を入力して実行してみましょう。',
    code: `# クエリ側: $title を宣言する
mutation CreateTodo($title: String!) {
  createTodo(title: $title) {
    id
    title
    done
  }
}

# 変数パネルに入力する JSON
{
  "title": "GraphQL を学ぶ"
}`,
  },
  {
    title: 'Apollo Client での使い方',
    body: 'React では Apollo Client の useQuery フックを使ってデータを取得します。',
    code: `import { gql, useQuery } from '@apollo/client'

const GET_TODOS = gql\`
  query {
    todos {
      id
      title
      done
    }
  }
\`

function TodoList() {
  const { loading, error, data } = useQuery(GET_TODOS)
  if (loading) return <p>読み込み中...</p>
  if (error) return <p>エラー: {error.message}</p>
  return (
    <ul>
      {data.todos.map(todo => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}`,
  },
]

export function QueryLearnView() {
  return (
    <div className="max-w-3xl">
      <LearnContent
        heading="GraphQL Query を学ぶ"
        description="Query はデータ読み取りのための操作です。必要なフィールドだけを宣言的に指定してデータを取得します。"
        sections={SECTIONS}
      />
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-700 mb-4">Query の概念を理解しましたか？</p>
        <UnderstandButton topic="query" />
      </div>
    </div>
  )
}
