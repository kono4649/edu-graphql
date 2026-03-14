import { useState } from 'react'
import { QueryEditor } from './query-editor'
import { ResultDisplay } from './result-display'
import { OperationSelector } from './operation-selector'
import { useGraphqlExecutor } from '@/features/playground/hooks/use-graphql-executor'
import { Button } from '@/shared/components/ui/button'

type OperationType = 'query' | 'mutation' | 'subscription'

const SAMPLE_QUERIES: Record<OperationType, string> = {
  query: `query {
  todos {
    id
    title
    done
  }
}`,
  mutation: `mutation {
  createTodo(title: "GraphQL を学ぶ") {
    id
    title
    done
  }
}`,
  subscription: `subscription {
  messageAdded {
    id
    content
    userId
    createdAt
  }
}`,
}

export function PlaygroundView() {
  const [operationType, setOperationType] = useState<OperationType>('query')
  const [queryStr, setQueryStr] = useState(SAMPLE_QUERIES.query)
  const { result, isSubscribed, execute, stopSubscription } = useGraphqlExecutor()

  const handleOperationChange = (op: OperationType) => {
    setOperationType(op)
    setQueryStr(SAMPLE_QUERIES[op])
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">GraphQL Playground</h1>
        <p className="text-gray-600 text-sm">
          クエリを入力して実行してください。Subscription はリアルタイムでメッセージを受信します。
        </p>
      </div>

      <div className="flex items-center gap-4">
        <OperationSelector selected={operationType} onChange={handleOperationChange} />
        <div className="flex gap-2 ml-auto">
          {isSubscribed && (
            <Button variant="danger" size="sm" onClick={stopSubscription}>
              接続を切断
            </Button>
          )}
          <Button size="sm" onClick={() => execute(queryStr, operationType)}>
            {operationType === 'subscription' ? '接続する' : '実行'}
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <QueryEditor value={queryStr} onChange={setQueryStr} />
        <ResultDisplay result={result} isSubscribed={isSubscribed} />
      </div>
    </div>
  )
}
