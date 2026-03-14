import { gql, useQuery } from '@apollo/client'

const MY_PROGRESS = gql`
  query MyProgress {
    myProgress {
      id
      topic
      completedAt
    }
  }
`

const TOPICS = [
  { key: 'query', label: 'Query' },
  { key: 'mutation', label: 'Mutation' },
  { key: 'subscription', label: 'Subscription' },
] as const

interface ProgressItem {
  id: string
  topic: string
  completedAt: string
}

interface MyProgressData {
  myProgress: ProgressItem[]
}

export function ProgressSidebar() {
  const { data } = useQuery<MyProgressData>(MY_PROGRESS, {
    fetchPolicy: 'cache-and-network',
  })

  const completedTopics = new Set(data?.myProgress.map((p) => p.topic) ?? [])

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-2">学習進捗</p>
      <ul className="space-y-1">
        {TOPICS.map((t) => (
          <li key={t.key} className="flex items-center gap-2 text-sm text-gray-700">
            {completedTopics.has(t.key) ? (
              <span className="text-green-500">✓</span>
            ) : (
              <span className="text-gray-300">○</span>
            )}
            {t.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
