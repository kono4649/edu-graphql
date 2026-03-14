import { LearnContent } from './learn-content'
import { UnderstandButton } from './understand-button'

const SECTIONS = [
  {
    title: 'Mutation とは',
    body: 'Mutation はサーバー上のデータを変更（作成・更新・削除）するための GraphQL オペレーションです。REST API でいう POST / PUT / DELETE に相当します。',
    code: `mutation {
  createTodo(title: "GraphQL を学ぶ") {
    id
    title
    done
  }
}`,
  },
  {
    title: 'データの作成',
    body: '新しいデータを作成するには createXxx という命名が一般的です。実行後に作成されたオブジェクトを返せます。',
    code: `mutation CreateTodo($title: String!) {
  createTodo(title: $title) {
    id
    title
    done
  }
}`,
  },
  {
    title: 'データの更新',
    body: '既存のデータを更新するには ID と更新内容を引数として渡します。',
    code: `mutation UpdateTodo($id: ID!, $done: Boolean!) {
  updateTodo(id: $id, done: $done) {
    id
    title
    done
  }
}`,
  },
  {
    title: 'データの削除',
    body: '削除操作は成功したかどうかを Boolean で返すことが多いです。',
    code: `mutation DeleteTodo($id: ID!) {
  deleteTodo(id: $id)
}`,
  },
  {
    title: 'Apollo Client での使い方',
    body: 'React では useMutation フックを使います。',
    code: `import { gql, useMutation } from '@apollo/client'

const CREATE_TODO = gql\`
  mutation CreateTodo($title: String!) {
    createTodo(title: $title) {
      id
      title
      done
    }
  }
\`

function AddTodo() {
  const [createTodo, { loading }] = useMutation(CREATE_TODO)

  return (
    <button onClick={() => createTodo({ variables: { title: 'New Task' } })}>
      {loading ? '作成中...' : 'Todo を追加'}
    </button>
  )
}`,
  },
]

export function MutationLearnView() {
  return (
    <div className="max-w-3xl">
      <LearnContent
        heading="GraphQL Mutation を学ぶ"
        description="Mutation はデータの作成・更新・削除を行う操作です。副作用を伴う変更はすべて Mutation として定義します。"
        sections={SECTIONS}
      />
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-700 mb-4">Mutation の概念を理解しましたか？</p>
        <UnderstandButton topic="mutation" />
      </div>
    </div>
  )
}
