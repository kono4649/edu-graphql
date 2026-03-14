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
    title: '引数付き Query',
    body: '引数を使ってフィルタリングや検索ができます。',
    code: `query GetTodo($id: ID!) {
  todo(id: $id) {
    id
    title
    done
  }
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
