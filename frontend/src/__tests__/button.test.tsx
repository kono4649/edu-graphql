import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/shared/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>クリック</Button>)
    expect(screen.getByText('クリック')).toBeTruthy()
  })

  it('calls onClick when clicked', async () => {
    let clicked = false
    render(<Button onClick={() => { clicked = true }}>クリック</Button>)
    await userEvent.click(screen.getByText('クリック'))
    expect(clicked).toBe(true)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>クリック</Button>)
    const btn = screen.getByText('クリック') as HTMLButtonElement
    expect(btn.disabled).toBe(true)
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">ボタン</Button>)
    expect(screen.getByText('ボタン').className).toContain('custom-class')
  })
})
