import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { Button } from '@/shared/components/ui/button'

const MARK_TOPIC_COMPLETE = gql`
  mutation MarkTopicComplete($topic: String!) {
    markTopicComplete(topic: $topic) {
      id
      topic
      completedAt
    }
  }
`

interface UnderstandButtonProps {
  topic: string
}

export function UnderstandButton({ topic }: UnderstandButtonProps) {
  const [done, setDone] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [markComplete, { loading }] = useMutation(MARK_TOPIC_COMPLETE, {
    onCompleted: () => {
      setDone(true)
      setErrorMessage(null)
    },
    onError: (err) => setErrorMessage(`保存に失敗しました: ${err.message}`),
    refetchQueries: ['MyProgress'],
  })

  if (done) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium">
        <span>✅</span>
        <span>理解しました！</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="primary"
        onClick={() => markComplete({ variables: { topic } })}
        disabled={loading}
      >
        {loading ? '保存中...' : '✓ 理解した'}
      </Button>
      {errorMessage && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}
    </div>
  )
}
