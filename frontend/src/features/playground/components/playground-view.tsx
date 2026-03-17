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
  mutation: `mutation CreateTodo($title: String!) {
  createTodo(title: $title) {
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

const SAMPLE_VARIABLES: Record<OperationType, string> = {
  query: '{}',
  mutation: '{\n  "title": "GraphQL を学ぶ"\n}',
  subscription: '{}',
}

export function PlaygroundView() {
  const [operationType, setOperationType] = useState<OperationType>('query')
  const [queryStr, setQueryStr] = useState(SAMPLE_QUERIES.query)
  const [variablesStr, setVariablesStr] = useState(SAMPLE_VARIABLES.query)
  const [variablesError, setVariablesError] = useState<string | null>(null)
  const { result, isSubscribed, execute, stopSubscription } = useGraphqlExecutor()

  const handleOperationChange = (op: OperationType) => {
    setOperationType(op)
    setQueryStr(SAMPLE_QUERIES[op])
    setVariablesStr(SAMPLE_VARIABLES[op])
    setVariablesError(null)
  }

  const handleExecute = () => {
    let variables: Record<string, unknown> | undefined
    const trimmed = variablesStr.trim()
    if (trimmed && trimmed !== '{}') {
      try {
        variables = JSON.parse(trimmed)
      } catch {
        setVariablesError('変数の JSON が不正です')
        return
      }
    }
    setVariablesError(null)
    execute(queryStr, operationType, variables)
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
          <Button size="sm" onClick={handleExecute}>
            {operationType === 'subscription' ? '接続する' : '実行'}
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        <div className="flex flex-col gap-2 min-h-0">
          <div className="flex-1 min-h-0">
            <QueryEditor value={queryStr} onChange={setQueryStr} />
          </div>
          <div className="h-36 flex flex-col">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              変数 <span className="text-gray-400 font-normal">(JSON)</span>
            </h3>
            <textarea
              className={`flex-1 w-full font-mono text-sm bg-gray-900 text-gray-100 border rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                variablesError ? 'border-red-500' : 'border-gray-300'
              }`}
              value={variablesStr}
              onChange={(e) => {
                setVariablesStr(e.target.value)
                setVariablesError(null)
              }}
              spellCheck={false}
            />
            {variablesError && (
              <p className="text-xs text-red-500 mt-1">{variablesError}</p>
            )}
          </div>
        </div>
        <ResultDisplay result={result} isSubscribed={isSubscribed} />
      </div>
    </div>
  )
}
