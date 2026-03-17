import { useState, useRef, useCallback } from 'react'
import { gql, Observable } from '@apollo/client'
import { apolloClient } from '@/shared/graphql/apollo-client'

type OperationType = 'query' | 'mutation' | 'subscription'

interface UseGraphqlExecutorReturn {
  result: string
  isSubscribed: boolean
  execute: (query: string, operationType: OperationType, variables?: Record<string, unknown>) => void
  stopSubscription: () => void
}

export function detectOperationType(queryStr: string): OperationType {
  const trimmed = queryStr.trim().toLowerCase()
  if (trimmed.startsWith('subscription')) return 'subscription'
  if (trimmed.startsWith('mutation')) return 'mutation'
  return 'query'
}

export function useGraphqlExecutor(): UseGraphqlExecutorReturn {
  const [result, setResult] = useState<string>('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const subscriptionRef = useRef<ReturnType<Observable<unknown>['subscribe']> | null>(null)

  const stopSubscription = useCallback(() => {
    subscriptionRef.current?.unsubscribe()
    subscriptionRef.current = null
    setIsSubscribed(false)
  }, [])

  const execute = useCallback(
    (queryStr: string, operationType: OperationType, variables?: Record<string, unknown>) => {
      stopSubscription()
      setResult('')

      const detectedType = operationType === 'query' ? detectOperationType(queryStr) : operationType
      const parsedQuery = gql(queryStr)

      if (detectedType === 'subscription') {
        setIsSubscribed(true)
        const observable = apolloClient.subscribe({ query: parsedQuery, variables })
        subscriptionRef.current = observable.subscribe({
          next: (data) => {
            setResult((prev) => {
              const lines = prev ? prev.split('\n---\n') : []
              lines.unshift(JSON.stringify(data, null, 2))
              return lines.slice(0, 20).join('\n---\n')
            })
          },
          error: (err: Error) => {
            setResult(`エラー: ${err.message}`)
            setIsSubscribed(false)
          },
        })
        return
      }

      if (detectedType === 'mutation') {
        apolloClient
          .mutate({ mutation: parsedQuery, variables })
          .then((data) => setResult(JSON.stringify(data, null, 2)))
          .catch((err: Error) => setResult(`エラー: ${err.message}`))
        return
      }

      apolloClient
        .query({ query: parsedQuery, variables, fetchPolicy: 'no-cache' })
        .then((data) => setResult(JSON.stringify(data, null, 2)))
        .catch((err: Error) => setResult(`エラー: ${err.message}`))
    },
    [stopSubscription]
  )

  return { result, isSubscribed, execute, stopSubscription }
}
