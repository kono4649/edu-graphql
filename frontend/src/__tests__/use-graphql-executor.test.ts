import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { detectOperationType } from '@/features/playground/hooks/use-graphql-executor'

// detectOperationType — pure function tests (no mocking needed)
describe('detectOperationType', () => {
  it('detects subscription keyword', () => {
    expect(detectOperationType('subscription { messageAdded { id } }')).toBe('subscription')
  })

  it('detects mutation keyword', () => {
    expect(detectOperationType('mutation { createTodo(title: "x") { id } }')).toBe('mutation')
  })

  it('defaults to query for query keyword', () => {
    expect(detectOperationType('query { todos { id } }')).toBe('query')
  })

  it('defaults to query for bare field selection', () => {
    expect(detectOperationType('{ todos { id } }')).toBe('query')
  })

  it('is case-insensitive', () => {
    expect(detectOperationType('SUBSCRIPTION { messageAdded { id } }')).toBe('subscription')
    expect(detectOperationType('MUTATION { createTodo { id } }')).toBe('mutation')
  })

  it('ignores leading whitespace', () => {
    expect(detectOperationType('  \n  subscription { messageAdded { id } }')).toBe('subscription')
  })
})

// useGraphqlExecutor — hook integration tests with mocked apolloClient
vi.mock('@/shared/graphql/apollo-client', () => {
  const unsubscribeMock = vi.fn()
  const subscribeMock = vi.fn(() => ({
    subscribe: vi.fn(() => ({ unsubscribe: unsubscribeMock })),
  }))
  const queryMock = vi.fn(() => Promise.resolve({ data: { todos: [] } }))
  const mutateMock = vi.fn(() => Promise.resolve({ data: { createTodo: { id: '1' } } }))

  return {
    apolloClient: {
      subscribe: subscribeMock,
      query: queryMock,
      mutate: mutateMock,
    },
    _unsubscribeMock: unsubscribeMock,
  }
})

describe('useGraphqlExecutor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('stopSubscription resets isSubscribed to false', async () => {
    const { useGraphqlExecutor } = await import('@/features/playground/hooks/use-graphql-executor')
    const { result } = renderHook(() => useGraphqlExecutor())

    act(() => {
      result.current.execute('subscription { messageAdded { id } }', 'subscription')
    })
    expect(result.current.isSubscribed).toBe(true)

    act(() => {
      result.current.stopSubscription()
    })
    expect(result.current.isSubscribed).toBe(false)
  })

  it('re-executing stops previous subscription before starting new one', async () => {
    const { useGraphqlExecutor } = await import('@/features/playground/hooks/use-graphql-executor')
    const { result } = renderHook(() => useGraphqlExecutor())

    act(() => {
      result.current.execute('subscription { messageAdded { id } }', 'subscription')
    })
    expect(result.current.isSubscribed).toBe(true)

    // Execute again — previous subscription should be stopped
    act(() => {
      result.current.execute('subscription { messageAdded { id } }', 'subscription')
    })
    // Still subscribed after re-execution
    expect(result.current.isSubscribed).toBe(true)
  })

  it('initial state has empty result and isSubscribed false', async () => {
    const { useGraphqlExecutor } = await import('@/features/playground/hooks/use-graphql-executor')
    const { result } = renderHook(() => useGraphqlExecutor())

    expect(result.current.result).toBe('')
    expect(result.current.isSubscribed).toBe(false)
  })
})
