import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ResultDisplay } from '@/features/playground/components/result-display'

describe('ResultDisplay', () => {
  it('shows placeholder when result is empty', () => {
    render(<ResultDisplay result="" isSubscribed={false} />)
    expect(screen.getByText('結果がここに表示されます')).toBeTruthy()
  })

  it('shows result when provided', () => {
    render(<ResultDisplay result='{"data": "test"}' isSubscribed={false} />)
    expect(screen.getByText('{"data": "test"}')).toBeTruthy()
  })

  it('shows subscription indicator when subscribed', () => {
    render(<ResultDisplay result="" isSubscribed={true} />)
    expect(screen.getByText('Subscription 接続中')).toBeTruthy()
  })

  it('hides subscription indicator when not subscribed', () => {
    render(<ResultDisplay result="" isSubscribed={false} />)
    expect(screen.queryByText('Subscription 接続中')).toBeNull()
  })
})
