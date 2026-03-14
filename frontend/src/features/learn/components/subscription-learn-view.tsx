import { LearnContent } from './learn-content'
import { UnderstandButton } from './understand-button'

const SECTIONS = [
  {
    title: 'Subscription とは',
    body: 'Subscription はサーバーからクライアントへリアルタイムにデータをプッシュするための GraphQL オペレーションです。WebSocket 接続を使い、サーバー側でイベントが発生したときにデータを受け取ります。',
    code: `subscription {
  messageAdded {
    id
    content
    userId
    createdAt
  }
}`,
  },
  {
    title: 'WebSocket との違い',
    body: 'WebSocket は低レベルの双方向通信プロトコルです。GraphQL Subscription はその上で動作し、型安全なリアルタイムデータフローを提供します。graphql-ws プロトコルが現在の標準です。',
    code: `# クライアントは接続を保持し続ける
# サーバーでイベントが発生するたびにデータが届く
subscription {
  messageAdded {
    content  # 必要なフィールドだけ選べる
  }
}`,
  },
  {
    title: 'Apollo Client での使い方',
    body: 'React では useSubscription フックを使います。WebSocket リンクの設定が必要です。',
    code: `import { gql, useSubscription } from '@apollo/client'

const MESSAGE_ADDED = gql\`
  subscription {
    messageAdded {
      id
      content
      userId
      createdAt
    }
  }
\`

function LiveChat() {
  const { data, loading } = useSubscription(MESSAGE_ADDED)

  if (loading) return <p>接続中...</p>
  return <div>{data?.messageAdded.content}</div>
}`,
  },
  {
    title: 'Apollo Client のセットアップ',
    body: 'Subscription には HTTP と WebSocket を組み合わせた split link が必要です。',
    code: `import { split } from '@apollo/client'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const wsLink = new GraphQLWsLink(
  createClient({ url: 'ws://localhost:8000/graphql' })
)

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query)
    return def.kind === 'OperationDefinition'
      && def.operation === 'subscription'
  },
  wsLink,  // Subscription → WebSocket
  httpLink // それ以外 → HTTP
)`,
  },
]

export function SubscriptionLearnView() {
  return (
    <div className="max-w-3xl">
      <LearnContent
        heading="GraphQL Subscription を学ぶ"
        description="Subscription は WebSocket を使ったリアルタイム通信の仕組みです。チャットやライブ更新など、プッシュ型の通知に適しています。"
        sections={SECTIONS}
      />
      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-gray-700 mb-4">Subscription の概念を理解しましたか？</p>
        <UnderstandButton topic="subscription" />
      </div>
    </div>
  )
}
